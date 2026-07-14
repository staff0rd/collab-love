# .github/workflows

## The Deploy workflow parks on an approval gate — do not "watch and wait"

Every push to `main` runs `web-deploy.yml` (workflow name **Deploy**). It has two
jobs: `deploy-web` builds/boot-checks/deploys the web app, then `testflight`
(`needs: deploy-web`) targets the `testflight` environment and **parks pending
approval**. Most pushes are left unapproved, so the run sitting at
`status: waiting` is the normal resting state — not a build still in progress.

A run at `status: waiting` will never advance on its own. Do not run
`gh run watch` on it or tell the user you're "waiting for it to finish" — it is
waiting for _you_. Releasing to TestFlight is a deliberate manual step: run the
`/deploy-ios` skill (approve the parked deployment), then watch. Only after
approval does watching make sense.

Concurrency is `group: deploy, cancel-in-progress: true`, so a newer push cancels
an earlier run still waiting for approval — only the latest un-released build is
ever pending.
