#!/usr/bin/env bash
# Produce a full, restorable logical dump of the remote Supabase Postgres (roles +
# schema + data) and upload it, gzipped and timestamped, to S3.
#
# The three dumps are concatenated in restore order (roles, then schema, then data)
# into a single self-contained SQL file, so recovery is `gunzip -c dump.sql.gz | psql`.
#
# Required environment:
#   SUPABASE_DB_URL   direct/session-pooler connection string incl. password (percent-encoded)
#   S3_BUCKET         destination bucket name
#   AWS_REGION        } standard AWS credentials, consumed by the aws CLI
#   AWS_ACCESS_KEY_ID }
#   AWS_SECRET_ACCESS_KEY
#
# Optional:
#   S3_PREFIX         key prefix within the bucket (default: db-backups)
set -euo pipefail

: "${SUPABASE_DB_URL:?SUPABASE_DB_URL is required}"
: "${S3_BUCKET:?S3_BUCKET is required}"
S3_PREFIX="${S3_PREFIX:-db-backups}"

workdir="$(mktemp -d)"
trap 'rm -rf "$workdir"' EXIT

stamp="$(date -u +%Y%m%dT%H%M%SZ)"
dump="$workdir/collab-love-$stamp.sql"

echo "Dumping roles, schema, and data from Supabase"
supabase db dump --db-url "$SUPABASE_DB_URL" --role-only -f "$workdir/roles.sql"
supabase db dump --db-url "$SUPABASE_DB_URL" -f "$workdir/schema.sql"
supabase db dump --db-url "$SUPABASE_DB_URL" --data-only --use-copy -f "$workdir/data.sql"

cat "$workdir/roles.sql" "$workdir/schema.sql" "$workdir/data.sql" > "$dump"
gzip "$dump"
archive="$dump.gz"

size="$(wc -c < "$archive" | tr -d ' ')"
if [ "$size" -lt 1024 ]; then
  echo "Dump is implausibly small (${size} bytes); refusing to upload." >&2
  exit 1
fi
echo "Built $(basename "$archive") (${size} bytes)"

dest="s3://$S3_BUCKET/$S3_PREFIX/$(basename "$archive")"
echo "Uploading to $dest"
aws s3 cp "$archive" "$dest"
echo "Backup complete"

if [ -n "${GITHUB_OUTPUT:-}" ]; then
  {
    echo "s3_url=$dest"
    echo "archive_name=$(basename "$archive")"
  } >> "$GITHUB_OUTPUT"
fi
