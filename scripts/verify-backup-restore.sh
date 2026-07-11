#!/usr/bin/env bash
# Restore a gzipped logical dump into a throwaway Postgres and assert the user
# tables came back. Proves a dump is genuinely restorable rather than merely
# non-empty; a corrupt or truncated dump leaves the tables missing and fails here.
#
# Supabase-specific roles, extensions, and auth.* references in the dump do not
# exist in a vanilla Postgres, so the restore itself is run tolerantly (psql
# continues past those errors). The verdict comes from the assertions below.
#
# Usage: verify-backup-restore.sh <dump.sql.gz> <target-db-url>
set -euo pipefail

dump="${1:?path to a .sql.gz dump is required}"
target="${2:?target Postgres connection URL is required}"
required_tables="${REQUIRED_TABLES:-households household_members scheduled_items}"

echo "Restoring $(basename "$dump") into the verification database"
gunzip -c "$dump" | psql "$target" >/dev/null

echo "Asserting expected tables exist"
for table in $required_tables; do
  exists="$(psql "$target" -tAc "select to_regclass('public.$table') is not null")"
  if [ "$exists" != "t" ]; then
    echo "FAIL: public.$table is missing from the restored dump" >&2
    exit 1
  fi
  count="$(psql "$target" -tAc "select count(*) from public.$table")"
  echo "  public.$table: $count rows"
done

echo "Restore verified"
