#!/usr/bin/env bash
# Regenerate (force) the App Store provisioning profile via fastlane match, pulling
# the App Store Connect API key and the match passphrase from 1Password. Use this
# after changing the app's capabilities (e.g. Sign In with Apple) so the profile in
# the certs repo picks up the new entitlement. The .p8 key is read from 1Password
# (never stored on disk or in git); only a short-lived temp copy exists for the run.
#
# The certs repo is pushed over SSH (git is SSH-configured locally), so no PAT is
# needed here — MATCH_GIT_BASIC_AUTHORIZATION is only for CI.
#
# Prerequisites: the 1Password CLI (`op`) signed in, `bundle install` in ios/, and
# SSH access to the certs repo.
#
# Override the defaults by exporting these before running:
#   ASC_KEY_ID / ASC_ISSUER_ID   App Store Connect API key identifiers
#   OP_ASC_P8_REF                1Password ref for the ASC API .p8 contents
#   OP_MATCH_PASSWORD_REF        1Password ref for the match passphrase
#   CERTS_GIT_URL                SSH URL of the certificates repo
#   APPLE_TEAM_ID                Developer Portal team ID
set -euo pipefail

ASC_KEY_ID="${ASC_KEY_ID:-N5YK6FM442}"
ASC_ISSUER_ID="${ASC_ISSUER_ID:-69a6de78-65b1-47e3-e053-5b8c7c11a4d1}"
APPLE_TEAM_ID="${APPLE_TEAM_ID:-D663PHG24B}"
OP_ASC_P8_REF="${OP_ASC_P8_REF:-op://Private/Apple Store Connect Auth Key/AuthKey_N5YK6FM442.p8}"
OP_MATCH_PASSWORD_REF="${OP_MATCH_PASSWORD_REF:-op://Private/collab-love MATCH_PASSWORD/password}"
CERTS_GIT_URL="${CERTS_GIT_URL:-git@github.com:staff0rd/collab-love-certificates.git}"

ios="$(cd "$(dirname "${BASH_SOURCE[0]}")/../ios" && pwd)"

api_key_json="$(mktemp)"
trap 'rm -f "$api_key_json"' EXIT

key_str="$(op read "$OP_ASC_P8_REF" | jq -Rs .)"
cat > "$api_key_json" <<EOF
{"key_id":"$ASC_KEY_ID","issuer_id":"$ASC_ISSUER_ID","key":$key_str,"duration":1200,"in_house":false}
EOF

export MATCH_PASSWORD
MATCH_PASSWORD="$(op read "$OP_MATCH_PASSWORD_REF" | tr -d '\n')"

cd "$ios"
bundle exec fastlane match appstore \
  --force \
  --api_key_path "$api_key_json" \
  --git_url "$CERTS_GIT_URL" \
  --team_id "$APPLE_TEAM_ID"
