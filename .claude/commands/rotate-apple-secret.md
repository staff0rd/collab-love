---
description: Rotate the Apple Sign-in client secret (trigger the rotation workflow and watch it)
---

The **Rotate Apple client secret** workflow (`.github/workflows/apple-secret-rotate.yml`, `workflow_dispatch`) re-signs the Apple client secret from the stored `.p8` and PATCHes it into the Supabase Management API auth config (`external_apple_secret`). It reads `APPLE_SIGNIN_KEY`, `APPLE_KEY_ID`, `APPLE_TEAM_ID`, and `SUPABASE_ACCESS_TOKEN` from repo secrets, and derives the project ref from the `VITE_SUPABASE_URL` variable. The secret expires every ~6 months, so run this before it lapses (a monthly cron automates it in a later phase).

This writes to the **production** Supabase project, so trigger it deliberately.

1. Dispatch the workflow on `main`:
   `gh workflow run apple-secret-rotate.yml -R staff0rd/collab-love --ref main`
2. Find the new run id (give Actions a moment to register it):
   `gh run list --workflow=apple-secret-rotate.yml -R staff0rd/collab-love --limit 1 --json databaseId,status -q '.[0]'`
3. Watch to completion and confirm the log shows `Management API responded with HTTP 200`:
   `gh run watch <id> -R staff0rd/collab-love --exit-status 2>&1`
4. Confirm web **Sign in with Apple** still works.
