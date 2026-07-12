# collab-love

## How to advise on this project

This is an early-stage app that will grow. When recommending architecture,
tools, or design:

- Decide for where the app is heading, not its current size. Never justify a
  choice by how few screens/features exist today.
- Give one recommendation and defend it. Don't present option menus or
  "it depends" unless asked to compare.
- Judge on quality and fit only. Don't raise effort, scope size, or cost as a
  factor, and don't call anything "good enough."
- Say when you're inferring. Don't state guesses as fact; verify instead.

## Commits

`/commit` produces exactly one commit. Do not split a session's changes into multiple commits unless explicitly asked.

## Supabase

New `public` tables are not auto-exposed to the Data API (`auto_expose_new_tables` is unset in `config.toml`, the cloud default). RLS policies alone are not enough — every migration that creates a table must also `grant` the matching privileges to `authenticated` (and any other role that queries it), or the client fails with "permission denied for table …".

## UI runs on both iOS and desktop

The app ships as a Capacitor iOS app and a desktop web app from the same code. Every screen and component must look right at both phone and desktop widths — build responsively (Tailwind `sm:` = 640px) and verify both. A layout that only suits one (e.g. a full-bleed mobile sheet on desktop) is a regression, not done.

## Native plugin / config changes

Adding or configuring a Capacitor plugin (new `@capacitor/*` dep, `capacitor.config.ts` `plugins` change, entitlement) is not done until the iOS project is synced and built. Run `npx cap sync ios`, then build/run on a Mac (`assist run run-ios`) to verify. Do not close out such a change as "needs a Mac rebuild" and stop — that step is part of the task, not an optional follow-up.

## iOS signing

After changing an iOS capability/entitlement, regenerate the `match` App Store profile by running `assist run match:sync` on a Mac. CI runs `match` readonly, so otherwise the archive fails with "provisioning profile doesn't include the … entitlement".
