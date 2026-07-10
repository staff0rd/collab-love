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

## iOS signing

After changing an iOS capability/entitlement, regenerate the `match` App Store profile by running `assist run match:sync` on a Mac. CI runs `match` readonly, so otherwise the archive fails with "provisioning profile doesn't include the … entitlement".
