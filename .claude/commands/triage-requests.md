---
description: Triage un-triaged in-app feature requests into the backlog via /draft
---

Read the household feature requests that have not yet been triaged, turn each into
a well-scoped backlog item using the `/draft` flow, and write the triage state back
to the row.

## Environment

Requires `SUPABASE_DB_URL` — the session-pooler connection string (including the
percent-encoded password) for the production Supabase Postgres. This is the same
connection the backup scripts use (`scripts/backup-db.sh`).

The value lives in 1Password (item `ysfqei6bt5mp3tmszb33nbtt2y`): the `url` field
holds the connection string with a literal `[YOUR-PASSWORD]` placeholder, and the
`database password` field holds the password. Build `SUPABASE_DB_URL` by substituting
the percent-encoded password into the placeholder. Do this inline in one command so
the secret is never printed or persisted — the shell does not carry env vars between
tool calls, so fetch and consume it within the same invocation:

```
ITEM=ysfqei6bt5mp3tmszb33nbtt2y
URL=$(op item get "$ITEM" --fields label=url --reveal)
PW=$(op item get "$ITEM" --fields "label=database password" --reveal)
ENC=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "$PW")
export SUPABASE_DB_URL="${URL/\[YOUR-PASSWORD\]/$ENC}"
```

If `op` is unavailable, ask the user to export `SUPABASE_DB_URL` themselves before
continuing (`: "${SUPABASE_DB_URL:?SUPABASE_DB_URL is required}"`).

This command reads from and writes to the **production** database.

## Step 1: Read un-triaged requests

A request is un-triaged when `backlog_item_id` is null. Rows that already have a
`backlog_item_id` are skipped — this is what makes re-runs idempotent. Read them
directly with `psql`:

```
psql "$SUPABASE_DB_URL" -A -F $'\t' -t -c \
  "select id, title, description from public.feature_requests where backlog_item_id is null order by created_at;"
```

If no rows come back, report that there is nothing to triage and stop.

## Step 2: Draft each request

For each row, run the `/draft` flow seeded with the request's title and description
so the normal clarifying-question flow produces a proper backlog item:

- Treat `<title>\n\n<description>` as the rough idea you would otherwise pass to
  `/draft` as `$ARGUMENTS`.
- Follow the `/draft` steps exactly: investigate the codebase, ask the user the
  clarifying questions, propose the item and phases, iterate, and only create it
  once the user confirms.
- `assist backlog add` prints the new item id — capture it. The `/draft` flow
  a-prefixes it (e.g. `a555`) when signalling done.

Draft one request at a time. Do not batch-create items without the per-request
`/draft` conversation.

## Step 3: Write back the triage state

**Only after the backlog item has been successfully created**, update that request's
row — never before. Set `status='triaged'` and record the a-prefixed item id:

```
psql "$SUPABASE_DB_URL" -c \
  "update public.feature_requests set status = 'triaged', backlog_item_id = 'a<id>' where id = '<request-uuid>';"
```

Use the request's `id` (uuid) from Step 1 as the `where` key and the item id from
Step 2 as `backlog_item_id`. Confirm the update reports `UPDATE 1`.

Repeat Steps 2-3 for each un-triaged request, then summarise which requests were
triaged and the backlog items they produced.
