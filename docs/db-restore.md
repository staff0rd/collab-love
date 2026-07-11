# Restoring a database backup

The [`Backup database`](../.github/workflows/db-backup.yml) workflow writes a full,
self-contained logical dump of the Supabase Postgres to S3 every day (and on manual
dispatch). This runbook covers recovering from one.

Each object is a single gzipped SQL file — roles, then schema, then data
(`COPY` blocks) concatenated in restore order — so recovery is a plain
`gunzip | psql`. There is no custom tooling to install.

## Where the dumps live

- **Bucket:** `collab-love-db-backups` (region `ap-southeast-2`, private, versioned).
- **Key:** `db-backups/collab-love-<UTC-timestamp>.sql.gz`, e.g.
  `db-backups/collab-love-20260711T085746Z.sql.gz`.
- **Retention:** the workflow prunes objects older than **30 days** on each run
  (`scripts/prune-backups.sh`). Recover from within that window; older dumps are gone.

## Prerequisites

- AWS credentials with read access to the bucket, exported as `AWS_ACCESS_KEY_ID`,
  `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION` (`ap-southeast-2`). The backup IAM user
  works, or use your own.
- `psql` (the `postgresql-client` package) for the restore.
- The target's connection string. For a Supabase project this is the
  **direct/session-pooler** URL including the password (Project Settings → Database),
  the same value stored in the `SUPABASE_DB_URL` secret.

## 1. Find and pull a dump

List what is available, newest last, and copy one down:

```sh
aws s3 ls s3://collab-love-db-backups/db-backups/

aws s3 cp \
  s3://collab-love-db-backups/db-backups/collab-love-20260711T085746Z.sql.gz \
  ./restore.sql.gz
```

## 2. Restore

### Into a local Postgres (inspect a dump safely)

Use the **`supabase/postgres`** image, not a vanilla `postgres` one. Public tables
reference Supabase internals — e.g. `scheduled_items.created_by` defaults to
`auth.uid()` — and Postgres resolves those at `CREATE TABLE` time, so on a stock image
that table is never created and its data never loads. The `supabase/postgres` image
ships the roles, `auth`/`storage`/`extensions` schemas, and `auth.uid()` the dump
expects. Match the project's major version (currently PG 17):

```sh
docker run -d --name restore -e POSTGRES_PASSWORD=postgres -p 5432:5432 \
  supabase/postgres:17.6.1.143

gunzip -c restore.sql.gz | psql "postgresql://postgres:postgres@localhost:5432/postgres"
```

### Into a Supabase project (real recovery)

Restore into an **empty** target — a freshly created or reset project. Restoring over
live data does not truncate first and will collide on primary keys.

```sh
gunzip -c restore.sql.gz | psql "$SUPABASE_DB_URL"
```

### Expect (and ignore) noise from Supabase internals

The dump replays Supabase's roles, schemas, and `auth`/`storage` data on top of a target
that already has them, so `psql` prints a stream of "already exists" / duplicate-key
errors and moves on. That is expected. What matters is that the `public` tables and their
data restore cleanly; confirm that in the next step rather than reading the error log.

## 3. Confirm the data came back

```sh
psql "$TARGET_DB_URL" -c "select count(*) from public.households;"
psql "$TARGET_DB_URL" -c "select count(*) from public.household_members;"
psql "$TARGET_DB_URL" -c "select count(*) from public.scheduled_items;"
```

This is exactly what CI checks: every backup run restores the dump it just wrote into a
throwaway Postgres and asserts these tables exist
(`scripts/verify-backup-restore.sh`), so a corrupt or empty dump fails the workflow
rather than sitting unnoticed in the bucket until it is needed.
