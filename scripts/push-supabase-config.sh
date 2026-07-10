#!/usr/bin/env bash
# Push supabase/config.toml to the linked project, injecting a freshly-signed Apple
# client secret. The .p8 private key is read from 1Password (never stored on disk or in
# git); only a short-lived temp copy exists for the duration of the run.
#
# Prerequisites: the 1Password CLI (`op`) signed in, the Supabase CLI logged in and
# linked, and Node.
#
# Override the defaults by exporting these before running:
#   OP_APPLE_P8_REF  1Password secret reference for the Sign in with Apple .p8
#   APPLE_KEY_ID     the key's 10-char Key ID
#   APPLE_TEAM_ID    your Apple Team ID
set -euo pipefail

OP_APPLE_P8_REF="${OP_APPLE_P8_REF:-op://Private/collab love Sign In with Apple key/AuthKey_7RY4JX7BUQ.p8}"
APPLE_KEY_ID="${APPLE_KEY_ID:-7RY4JX7BUQ}"
APPLE_TEAM_ID="${APPLE_TEAM_ID:-D663PHG24B}"

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

export APPLE_KEY_ID APPLE_TEAM_ID APPLE_SIGNIN_KEY
APPLE_SIGNIN_KEY="$(op read "$OP_APPLE_P8_REF")"

export SUPABASE_AUTH_EXTERNAL_APPLE_SECRET
SUPABASE_AUTH_EXTERNAL_APPLE_SECRET="$(node "$here/apple-secret.mjs")"

supabase config push
