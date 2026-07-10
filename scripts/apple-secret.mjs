import { sign } from "node:crypto";

const {
  APPLE_SIGNIN_KEY,
  APPLE_KEY_ID,
  APPLE_TEAM_ID,
  APPLE_SERVICES_ID = "love.collab.app.web",
} = process.env;

if (!APPLE_SIGNIN_KEY || !APPLE_KEY_ID || !APPLE_TEAM_ID) {
  console.error(
    "Missing required env vars: set APPLE_SIGNIN_KEY (.p8 contents), APPLE_KEY_ID and APPLE_TEAM_ID (and optionally APPLE_SERVICES_ID).",
  );
  process.exit(1);
}

const SIX_MONTHS = 15_777_000;
const now = Math.floor(Date.now() / 1000);

const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");

const header = { alg: "ES256", kid: APPLE_KEY_ID };
const payload = {
  aud: "https://appleid.apple.com",
  exp: now + SIX_MONTHS,
  iat: now,
  iss: APPLE_TEAM_ID,
  sub: APPLE_SERVICES_ID,
};

const signingInput = `${b64(header)}.${b64(payload)}`;
const signature = sign("sha256", Buffer.from(signingInput), {
  dsaEncoding: "ieee-p1363",
  key: APPLE_SIGNIN_KEY,
}).toString("base64url");

process.stdout.write(`${signingInput}.${signature}`);
