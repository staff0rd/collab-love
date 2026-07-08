import { readFileSync } from "node:fs";
import { sign } from "node:crypto";

const [p8Path, keyId, teamId] = process.argv.slice(2);
const serviceId = "love.collab.app.web";

if (!p8Path || !keyId || !teamId) {
  console.error("Usage: node apple-secret.mjs <path-to.p8> <KEY_ID> <TEAM_ID>");
  process.exit(1);
}

const SIX_MONTHS = 15_777_000;
const now = Math.floor(Date.now() / 1000);

const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");

const header = { alg: "ES256", kid: keyId };
const payload = {
  aud: "https://appleid.apple.com",
  exp: now + SIX_MONTHS,
  iat: now,
  iss: teamId,
  sub: serviceId,
};

const signingInput = `${b64(header)}.${b64(payload)}`;
const key = readFileSync(p8Path);
const signature = sign("sha256", Buffer.from(signingInput), {
  dsaEncoding: "ieee-p1363",
  key,
}).toString("base64url");

console.log(`${signingInput}.${signature}`);
