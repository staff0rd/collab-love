const PRODUCTION_HOST = "https://api.push.apple.com";
const SANDBOX_HOST = "https://api.sandbox.push.apple.com";
const TOPIC = "love.collab.app";
const WRONG_ENVIRONMENT = "BadDeviceToken";
const UNREGISTERED_STATUS = 410;
const STORE_AND_RETRY_SECONDS = 3_600;
const SECOND_MS = 1_000;
const AWAKE = 1;

export type PushOutcome = "delivered" | "unregistered" | "rejected";

export type PushResult = {
  token: string;
  outcome: PushOutcome;
  reason: string | null;
};

type Attempt = { ok: boolean; status: number; reason: string | null };

const reasonOf = (body: string): string | null => {
  try {
    const parsed = JSON.parse(body) as { reason?: string };
    return parsed.reason ?? null;
  } catch {
    return null;
  }
};

const expiry = (): string => String(Math.floor(Date.now() / SECOND_MS) + STORE_AND_RETRY_SECONDS);

const deliver = async (host: string, token: string, providerToken: string): Promise<Attempt> => {
  const response = await fetch(`${host}/3/device/${token}`, {
    body: JSON.stringify({ aps: { "content-available": AWAKE } }),
    headers: {
      "apns-expiration": expiry(),
      "apns-priority": "5",
      "apns-push-type": "background",
      "apns-topic": TOPIC,
      authorization: `bearer ${providerToken}`,
    },
    method: "POST",
  });
  return { ok: response.ok, reason: reasonOf(await response.text()), status: response.status };
};

const outcomeOf = (attempt: Attempt): PushOutcome => {
  if (attempt.ok) {
    return "delivered";
  }
  if (attempt.status === UNREGISTERED_STATUS) {
    return "unregistered";
  }
  return "rejected";
};

const resultOf = (token: string, attempt: Attempt): PushResult => ({
  outcome: outcomeOf(attempt),
  reason: attempt.reason,
  token,
});

export const sendSilentPush = async (token: string, providerToken: string): Promise<PushResult> => {
  const production = await deliver(PRODUCTION_HOST, token, providerToken);
  if (production.reason !== WRONG_ENVIRONMENT) {
    return resultOf(token, production);
  }
  return resultOf(token, await deliver(SANDBOX_HOST, token, providerToken));
};
