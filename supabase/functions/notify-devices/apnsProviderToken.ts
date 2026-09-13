import type { ApnsCredentials } from "./apnsCredentials.ts";

const REUSE_WINDOW_MINUTES = 50;
const MINUTE_MS = 60_000;
const SECOND_MS = 1_000;
const FIRST_CHARACTER = 0;
const REUSE_WINDOW_MS = REUSE_WINDOW_MINUTES * MINUTE_MS;

type SignedToken = { value: string; signedAt: number };

let cached: SignedToken | null = null;

const base64Url = (bytes: Uint8Array): string =>
  btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");

const encodeSegment = (segment: unknown): string =>
  base64Url(new TextEncoder().encode(JSON.stringify(segment)));

const toByte = (character: string): number => character.charCodeAt(FIRST_CHARACTER);

const importSigningKey = (privateKey: string): Promise<CryptoKey> => {
  const body = privateKey.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const der = Uint8Array.from(atob(body), toByte);
  return crypto.subtle.importKey("pkcs8", der, { name: "ECDSA", namedCurve: "P-256" }, false, [
    "sign",
  ]);
};

const sign = async (credentials: ApnsCredentials, signedAt: number): Promise<string> => {
  const header = { alg: "ES256", kid: credentials.keyId };
  const payload = { iat: Math.floor(signedAt / SECOND_MS), iss: credentials.teamId };
  const signingInput = `${encodeSegment(header)}.${encodeSegment(payload)}`;
  const signature = await crypto.subtle.sign(
    { hash: "SHA-256", name: "ECDSA" },
    await importSigningKey(credentials.privateKey),
    new TextEncoder().encode(signingInput),
  );
  return `${signingInput}.${base64Url(new Uint8Array(signature))}`;
};

export const apnsProviderToken = async (credentials: ApnsCredentials): Promise<string> => {
  const now = Date.now();
  if (cached !== null && now - cached.signedAt < REUSE_WINDOW_MS) {
    return cached.value;
  }
  const value = await sign(credentials, now);
  cached = { signedAt: now, value };
  return value;
};
