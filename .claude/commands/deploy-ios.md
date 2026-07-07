---
description: Build and upload a new iOS build to TestFlight
---

Manually trigger the iOS TestFlight pipeline (macOS runner minutes are metered, so this deploy is intentionally not automatic on push).

1. Trigger the workflow on the default branch:
   `gh workflow run ios-testflight.yml --ref main 2>&1`
2. Find the run it created and watch it to completion:
   `sleep 8 && gh run list --workflow=ios-testflight.yml --limit 1 --json databaseId,status -q '.[0].databaseId'`
   then `gh run watch <id> --exit-status 2>&1`
3. On success, confirm the build reached TestFlight by checking the log for `Successfully uploaded the new binary to App Store Connect`. On failure, surface the failing step's error.
