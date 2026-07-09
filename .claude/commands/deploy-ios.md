---
description: Release the latest build to TestFlight (approve the parked deploy)
---

TestFlight is not a separate trigger. Every push to `main` runs the **Deploy** workflow: `deploy-web` builds, runs the boot check, and deploys the web app, then the `testflight` job parks on the `testflight` environment waiting for approval. Approving that pending deployment is what releases the build to TestFlight; most pushes are left unapproved.

A newer push cancels an earlier run that is still waiting for approval (workflow concurrency `cancel-in-progress`), so only the latest un-released build is ever pending.

1. Find the latest run and confirm its `testflight` job is waiting:
   `gh run list --workflow=web-deploy.yml --branch main --limit 1 --json databaseId,status -q '.[0]'`
2. Approve the parked deployment (releases it to TestFlight):
   `gh api -X POST repos/staff0rd/collab-love/actions/runs/<id>/pending_deployments -F "environment_ids[]=17887214524" -f state=approved -f comment="release" 2>&1`
   (or open the run in the browser and click **Review deployments → Approve**)
3. Watch to completion and confirm the log shows `Successfully uploaded the new binary to App Store Connect`:
   `gh run watch <id> --exit-status 2>&1`
