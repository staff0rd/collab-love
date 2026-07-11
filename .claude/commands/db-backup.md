---
description: Trigger the database backup workflow (dump to S3, restore-verify, prune) and watch it
---

The **Backup database** workflow (`.github/workflows/db-backup.yml`, `workflow_dispatch` + daily cron) runs `scripts/backup-db.sh` to produce a full logical dump (roles + schema + data) of the production Supabase Postgres, gzips and timestamps it, and uploads it to `s3://$S3_BUCKET/db-backups/`. It then pulls the fresh dump back, restores it into a throwaway `supabase/postgres` service container to prove it is restorable (`scripts/verify-backup-restore.sh`), and prunes objects older than 30 days (`scripts/prune-backups.sh`). It reads `SUPABASE_DB_URL` and `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_REGION` / `S3_BUCKET` from repo secrets.

This reads from the **production** database and writes to the backup bucket; a manual run is safe (it never writes to the database), but it does consume a backup slot and prune old objects, so trigger it deliberately.

1. Dispatch the workflow on `main`:
   `gh workflow run db-backup.yml -R staff0rd/collab-love --ref main`
2. Find the new run id (give Actions a moment to register it):
   `gh run list --workflow=db-backup.yml -R staff0rd/collab-love --limit 1 --json databaseId,status -q '.[0]'`
3. Watch to completion and confirm the log shows `Backup complete`, `Restore verified`, and `Prune complete`:
   `gh run watch <id> -R staff0rd/collab-love --exit-status 2>&1`
4. Optionally confirm the new object landed:
   `aws s3 ls s3://collab-love-db-backups/db-backups/ | tail -3`
