#!/usr/bin/env bash
# Delete database backups older than the retention window from S3, logging each
# removal. Kept provider-agnostic (plain aws s3api list/delete, no lifecycle rule)
# so a later move to R2/B2 is an endpoint + credential-name change only.
#
# Required environment:
#   S3_BUCKET         bucket to prune
#   AWS_REGION        } standard AWS credentials, consumed by the aws CLI
#   AWS_ACCESS_KEY_ID }
#   AWS_SECRET_ACCESS_KEY
#
# Optional:
#   S3_PREFIX         key prefix within the bucket (default: db-backups)
#   RETENTION_DAYS    age at which a backup is pruned (default: 30)
set -euo pipefail

: "${S3_BUCKET:?S3_BUCKET is required}"
S3_PREFIX="${S3_PREFIX:-db-backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

cutoff="$(date -u -d "$RETENTION_DAYS days ago" +%s)"
echo "Pruning s3://$S3_BUCKET/$S3_PREFIX/ older than $RETENTION_DAYS days (before $(date -u -d "@$cutoff" +%Y-%m-%dT%H:%M:%SZ))"

listing="$(aws s3api list-objects-v2 \
  --bucket "$S3_BUCKET" \
  --prefix "$S3_PREFIX/" \
  --query 'Contents[].[Key,LastModified]' \
  --output text)"

if [ -z "$listing" ] || [ "$listing" = "None" ]; then
  echo "Bucket is empty; nothing to prune"
  exit 0
fi

pruned=0
kept=0
while IFS=$'\t' read -r key last_modified; do
  [ -z "$key" ] && continue
  modified_epoch="$(date -u -d "$last_modified" +%s)"
  if [ "$modified_epoch" -lt "$cutoff" ]; then
    echo "Deleting $key (last modified $last_modified)"
    aws s3api delete-object --bucket "$S3_BUCKET" --key "$key" >/dev/null
    pruned=$((pruned + 1))
  else
    kept=$((kept + 1))
  fi
done <<< "$listing"

echo "Prune complete: $pruned removed, $kept retained"
