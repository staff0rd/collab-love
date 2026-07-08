# collab-love

## Commits

`/commit` produces exactly one commit. Do not split a session's changes into multiple commits unless explicitly asked.

## iOS signing

After changing an iOS capability/entitlement, regenerate the `match` App Store profile by running `assist run match:sync` on a Mac. CI runs `match` readonly, so otherwise the archive fails with "provisioning profile doesn't include the … entitlement".
