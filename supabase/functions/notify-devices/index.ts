import { apnsCredentials } from "./apnsCredentials.ts";
import { apnsProviderToken } from "./apnsProviderToken.ts";
import { deleteDeviceTokens } from "./deleteDeviceTokens.ts";
import { householdDeviceTokens } from "./householdDeviceTokens.ts";
import { sendSilentPush, type PushOutcome, type PushResult } from "./sendSilentPush.ts";

const OK = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const METHOD_NOT_ALLOWED = 405;
const SERVER_ERROR = 500;
const NO_TOKENS = 0;

type NotifyRequest = { household_id?: unknown; actor?: unknown };

const json = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json" },
    status,
  });

const isFromWebhook = (request: Request): boolean => {
  const secret = Deno.env.get("NOTIFY_DEVICES_SECRET");
  return secret !== undefined && request.headers.get("authorization") === `Bearer ${secret}`;
};

const reject = (request: Request): Response | null => {
  if (request.method !== "POST") {
    return json(METHOD_NOT_ALLOWED, { error: "Only POST is accepted" });
  }
  if (!isFromWebhook(request)) {
    return json(UNAUTHORIZED, { error: "Not called with the webhook secret" });
  }
  return null;
};

const actorOf = (payload: NotifyRequest): string | null => {
  if (typeof payload.actor === "string") {
    return payload.actor;
  }
  return null;
};

const tally = (results: PushResult[], outcome: PushOutcome): number =>
  results.filter((result) => result.outcome === outcome).length;

const pruneUnregistered = async (results: PushResult[]): Promise<void> => {
  const dead = results
    .filter((result) => result.outcome === "unregistered")
    .map((result) => result.token);
  if (dead.length > NO_TOKENS) {
    await deleteDeviceTokens(dead);
  }
};

const notify = async (householdId: string, actor: string | null): Promise<Response> => {
  const tokens = await householdDeviceTokens(householdId, actor);
  if (tokens.length === NO_TOKENS) {
    return json(OK, { delivered: NO_TOKENS, rejected: NO_TOKENS, unregistered: NO_TOKENS });
  }
  const providerToken = await apnsProviderToken(apnsCredentials());
  const results = await Promise.all(tokens.map((token) => sendSilentPush(token, providerToken)));
  for (const result of results.filter((candidate) => candidate.outcome !== "delivered")) {
    console.error(`APNs ${result.outcome} for ${result.token}: ${result.reason ?? "no reason"}`);
  }
  await pruneUnregistered(results);
  return json(OK, {
    delivered: tally(results, "delivered"),
    rejected: tally(results, "rejected"),
    unregistered: tally(results, "unregistered"),
  });
};

Deno.serve(async (request: Request): Promise<Response> => {
  const rejected = reject(request);
  if (rejected !== null) {
    return rejected;
  }
  const payload = (await request.json().catch(() => ({}))) as NotifyRequest;
  if (typeof payload.household_id !== "string") {
    return json(BAD_REQUEST, { error: "household_id is required" });
  }
  try {
    return await notify(payload.household_id, actorOf(payload));
  } catch (cause) {
    console.error("Failed to send the silent pushes", cause);
    return json(SERVER_ERROR, { error: "Failed to send the silent pushes" });
  }
});
