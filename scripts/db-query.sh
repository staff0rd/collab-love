#!/usr/bin/env bash
# Run a read-only query against the linked Supabase project through the Management API,
# so prod data can be inspected without psql or the database password.
#
#   scripts/db-query.sh "select id, title from scheduled_items limit 5"
#   scripts/db-query.sh -f path/to/query.sql
#
# Reads only, by construction: the request is sent read_only and anything that does not
# open with select/with/explain/show/table is refused. Schema and data changes belong in
# supabase/migrations, not here.
#
# Prerequisites: a Supabase personal access token (dashboard -> Account -> Access Tokens),
# either exported as SUPABASE_ACCESS_TOKEN or stored in 1Password at the reference below
# with the `op` CLI signed in.
#
# Override the defaults by exporting these before running:
#   SUPABASE_ACCESS_TOKEN      the token itself, skipping 1Password
#   SUPABASE_ACCESS_TOKEN_REF  1Password secret reference holding the token
#   SUPABASE_PROJECT_REF       project ref, defaulting to the linked one
set -euo pipefail

SUPABASE_ACCESS_TOKEN_REF="${SUPABASE_ACCESS_TOKEN_REF:-op://Private/collab-love-agent-query/token}"

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_ref="${SUPABASE_PROJECT_REF:-$(cat "$here/../supabase/.temp/project-ref")}"

if [[ "${1:-}" == "-f" ]]; then
  query="$(cat "${2:?usage: scripts/db-query.sh -f <file>}")"
else
  query="${1:-}"
fi

if [[ -z "$query" ]]; then
  echo "usage: scripts/db-query.sh \"<sql>\" | -f <file>" >&2
  exit 64
fi

opening="$(printf '%s' "$query" | sed -E 's/^[[:space:]]*//' | tr '[:upper:]' '[:lower:]')"
case "$opening" in
  select*|with*|explain*|show*|table*) ;;
  *)
    echo "refusing to run a statement that is not a read" >&2
    exit 65
    ;;
esac

token="${SUPABASE_ACCESS_TOKEN:-$(op read "$SUPABASE_ACCESS_TOKEN_REF")}"

payload="$(jq -n --arg q "$query" '{query: $q, read_only: true}')"

curl -sS --fail-with-body \
  -X POST "https://api.supabase.com/v1/projects/$project_ref/database/query" \
  -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" \
  -d "$payload" | jq .
