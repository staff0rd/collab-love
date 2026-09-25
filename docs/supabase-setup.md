# Supabase + Sign in with Apple setup

Phase 1 wires the app up to a Supabase project and gates it behind an authenticated
session using **Sign in with Apple** over the web OAuth redirect flow. The code reads
its configuration from two environment variables; this doc covers the setup needed to
fill them in.

Supabase config is kept as **infrastructure as code** (see `CLAUDE.md`): schema lives in
`supabase/migrations/`, and auth/provider settings live in `supabase/config.toml` and are
applied with `supabase config push`. Prefer editing those files over clicking through the
dashboard. The only genuinely manual part is the Apple Developer portal, which has no CLI.

## 1. Create the Supabase project

1. In the [Supabase dashboard](https://supabase.com/dashboard), create a **New project**
   inside your existing organisation.
2. Name it (e.g. `collab-love`), pick a region close to home, and set a strong database
   password (store it in your password manager).
3. Leave the **Data API** enabled with the default `public` schema — the household
   tables (Phase 2) and later scheduled-item data live there, accessed with Row Level
   Security.

### Data API settings

These are independent of authentication (sign-in works regardless), but they govern how
the household/schedule tables are exposed:

- **Enable Data API → ON.** The client reads the household tables via
  `supabase.from(...)`, which goes through the Data API.
- **Enable automatic RLS → ON.** The whole security model is RLS (the anon key ships in
  the client bundle). Auto-RLS guarantees no table is ever exposed without it.
- **Automatically expose new tables → OFF (preferred).** Opt each table into the API
  explicitly. With auto-RLS on it is safe either way; OFF just keeps control deliberate.

## 2. Fill in the environment variables

1. Copy `.env.example` to `.env` in the project root.
2. In the dashboard go to **Project Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / publishable public key** → `VITE_SUPABASE_ANON_KEY`

`.env` is gitignored. The anon key is a public client key (it ships in the web bundle);
data is protected by Row Level Security, not by hiding this key.

### CI builds

`.env` is local-only, so CI has no values to read from — the build inlines them from
GitHub Actions **repository variables** instead (they are public client values, not
secrets, so `vars` rather than `secrets`). Both `npm run build` steps in
`.github/workflows/web-deploy.yml` (web deploy and the iOS TestFlight bundle) pass:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Add both under **Settings → Secrets and variables → Actions → Variables**. Without them
the bundle boots to a black screen (`supabaseClient` throws `Missing Supabase
configuration` at module load); the pre-deploy boot check (`verify:boot`) now fails the
workflow instead of shipping it.

## 3. Configure Sign in with Apple (Apple Developer)

You need a paid Apple Developer account. In the
[Apple Developer portal](https://developer.apple.com/account/resources):

1. **App ID** — under _Identifiers_, ensure the app identifier `love.collab.app` exists
   with the **Sign In with Apple** capability enabled.
2. **Services ID** — create a _Services ID_ (e.g. `love.collab.app.web`). This is the
   OAuth `client_id` used for the **web** flow.
   - Enable **Sign In with Apple** on it and click **Configure**.
   - **Primary App ID**: `love.collab.app`.
   - **Domains**: your Supabase project domain, `PROJECT_REF.supabase.co`.
   - **Return URLs**: `https://PROJECT_REF.supabase.co/auth/v1/callback`.
3. **Key** — create a _Key_ with **Sign In with Apple** enabled and download the `.p8`
   file (you only get one download). Note the **Key ID** and your **Team ID**.

## 4. Enable the Apple provider (config as code)

The provider is configured in `supabase/config.toml`, not the dashboard:

- `[auth.external.apple]` — `enabled = true`, and `client_id` lists **both** the web
  Services ID and the native bundle id: `"love.collab.app.web,love.collab.app"`. Listing
  both means tokens from the web redirect _and_ the native `signInWithIdToken` flow are
  accepted.
- The secret is never committed — it is resolved at push time from the
  `SUPABASE_AUTH_EXTERNAL_APPLE_SECRET` environment variable
  (`secret = "env(SUPABASE_AUTH_EXTERNAL_APPLE_SECRET)"`).
- `[auth]` `site_url` / `additional_redirect_urls` allow-list the web origins. The app calls
  `signInWithOAuth` with `redirectTo` set to `window.location.origin`, so **every** origin the
  app is served from must be listed — a `redirectTo` that matches nothing on the list is
  silently ignored and Supabase falls back to `site_url`. The current origins are:
  - `https://dashing-cajeta-61d2c9.netlify.app` — the deployed web app, and `site_url`, so
    it is also the fallback for any unmatched redirect.
  - `http://localhost:5173` — local dev (`npm run dev`).

  `additional_redirect_urls` entries are _exact_ URLs (no trailing slash, no implicit
  subdomains). Netlify deploy previews are not listed because `web-deploy.yml` only ever runs
  `netlify deploy --prod`, so no preview origins are produced; add them if that changes.

The Apple **client secret** is an ES256 JWT signed from the `.p8` key; it expires after
~6 months. `scripts/apple-secret.mjs` mints it, and `scripts/push-supabase-config.sh`
(wired up as `assist run supabase:config`) reads the `.p8` from 1Password, signs a fresh
secret, and runs `supabase config push`:

```sh
assist run supabase:config
```

This writes to the production project, so run it yourself. Override `OP_APPLE_P8_REF`,
`APPLE_KEY_ID`, or `APPLE_TEAM_ID` if the defaults in the script do not match your setup.
Because it expires, the secret is also rotated automatically in CI — see
[Rotating the Apple client secret](#9-rotating-the-apple-client-secret-automated).

## 5. Verify the web flow

1. `npm run dev`, open the app — you should see the **Sign in with Apple** screen.
2. Click it, complete the Apple flow, and you should be redirected back and land on the
   Home screen. **Sign out** returns you to the login screen.

## 6. Native Sign in with Apple (Phase 2)

The iOS app uses the `@capacitor-community/apple-sign-in` plugin and exchanges the
returned identity token for a Supabase session (`signInWithIdToken`), rather than the
web redirect. The app branches on `Capacitor.isNativePlatform()`.

1. **Supabase Apple provider** — the native bundle id `love.collab.app` is already in
   `client_id` in `supabase/config.toml` (alongside the web Services ID), so native
   identity tokens are accepted. No dashboard step needed.
2. **Xcode capability** — open `ios/App/App.xcworkspace` and add the **Sign in with
   Apple** capability to the `App` target (Signing & Capabilities → + Capability). This
   is required for the native sheet to appear.
3. Run `npm run ios:sync` to build the web bundle and copy it into the iOS project.

## 7. Household schema

`supabase/migrations/20260708120445_household.sql` creates `households` and
`household_members` (both RLS-enabled), seeds a single `Home` household, and adds a
trigger that assigns every new `auth.users` row to it. Because only the two known Apple
accounts can sign in, both land in the same household — and since Apple returns the same
email for a given Apple ID across the web and native flows, one person is the same
Supabase user in both. RLS lets a member read only their own household and its members.

Apply it to the linked project (this writes to the production database, so run it
yourself):

```sh
assist run supabase:deploy
```

## 8. Verify the native flow

1. `npm run ios:run` (or run from Xcode) on a device with an Apple ID signed in.
2. Tap **Sign in with Apple** — the native sheet appears; completing it lands on Home.
3. Home shows the household name and member count; signing in with the second account
   shows the same household with the count at **2**.

## 9. Rotating the Apple client secret (automated)

The Apple client secret is an ES256 JWT that Apple caps at a ~6-month lifetime, so it has
to be re-minted and pushed to Supabase before it expires or web sign-in breaks. The
`.github/workflows/apple-secret-rotate.yml` workflow does this with no dashboard steps: it
runs `scripts/apple-secret.mjs` to sign a fresh secret from the stored `.p8`, then PATCHes
the [Supabase Management API](https://supabase.com/docs/reference/api) auth config
(`external_apple_secret`) on the linked project.

### Rotation cadence

The workflow runs automatically on a monthly `schedule` (03:17 UTC on the 1st of each
month), so the live secret is never more than a month old and there is a wide margin before
Apple's ~6-month cap. Each run re-mints the secret with a fresh 6-month expiry and pushes it,
so the schedule alone keeps web sign-in from ever breaking on an expired secret.

### Rotating manually

You rarely need to, but you can force a rotation at any time — for example after replacing the
`.p8` key or the `SUPABASE_ACCESS_TOKEN`. Trigger it on demand from the **Actions** tab →
**Rotate Apple client secret** → **Run workflow**. The manual run is identical to the scheduled
one.

### Required repository secrets

Add these under **Settings → Secrets and variables → Actions → Secrets**:

| Secret                  | Value                                                                                                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `APPLE_SIGNIN_KEY`      | The full contents of the Sign in with Apple `.p8` key file (paste the whole PEM, `-----BEGIN PRIVATE KEY-----` through `-----END PRIVATE KEY-----`, newlines and all). |
| `APPLE_KEY_ID`          | The key's 10-char Key ID (from the Apple Developer portal, same key as the `.p8`).                                                                                     |
| `APPLE_TEAM_ID`         | Your Apple Team ID.                                                                                                                                                    |
| `SUPABASE_ACCESS_TOKEN` | A Supabase personal access token with access to the project. Generate one at **Supabase dashboard → Account → Access Tokens**.                                         |

The workflow derives the project ref from the existing `VITE_SUPABASE_URL` repository
**variable** (`https://<ref>.supabase.co`), so there is no separate ref secret to set. The
Services ID defaults to `love.collab.app.web`; override it by setting an `APPLE_SERVICES_ID`
env var on the workflow step if that ever changes.

The minted secret is masked in the workflow logs (`::add-mask::`), so it is never printed.

## 10. Silent push to refresh the widget

The lock screen widget reads an App Group snapshot that only the app can write, so a change made on one device does not reach the other device's widget until that app is next foregrounded. A database webhook on `household_events` calls the `notify-devices` edge function, which sends a `content-available` push to every device in the household except those of the user who made the change.

The chain is: a write to `scheduled_items` → the `log_household_event` trigger appends to `household_events` → the `household_events_notify_devices` trigger posts to the function with `pg_net` → the function reads `device_tokens` with the service role and sends to APNs. Only `scheduled_items` is covered; widening it is a change to the trigger's `when` clause.

### Apple Developer

1. **App ID** — under _Identifiers_, enable **Push Notifications** on `love.collab.app`. `match` regenerates a profile from the App ID's current capabilities but does not enable them, so this is a portal step. Run `assist run match:sync` on a Mac afterwards or CI's `beta` lane archives with a profile that has no `aps-environment`.
2. **Key** — create a _Key_ with **Apple Push Notifications service (APNs)** enabled, scoped to **Sandbox & Production** so the one key signs for both hosts, and download the `.p8` (you only get one download). Note the **Key ID** and your **Team ID**. This is a third key, separate from the Sign in with Apple one and the App Store Connect API one. Leave the App ID's _Apple Push Notification service SSL Certificates_ panel empty — that is the older certificate-based auth, which expires yearly and is per-App-ID; the `.p8` replaces it.

### Function secrets

The `.p8` never goes in the repo. It lives in 1Password at `op://Private/collab-love APNs key/AuthKey_8T2FM45363.p8`, and is set on the linked project from there:

```sh
supabase secrets set \
  APNS_KEY_ID=8T2FM45363 \
  APNS_TEAM_ID=D663PHG24B \
  APNS_PRIVATE_KEY="$(op read 'op://Private/collab-love APNs key/AuthKey_8T2FM45363.p8')"
```

`NOTIFY_DEVICES_SECRET` is the fourth secret, and is what the webhook proves itself with. It is a random value belonging to this one call, not a project key: `verify_jwt` is off for this function because satisfying it would admit any signed-in member's JWT, and because the alternative is keeping a credential that bypasses RLS in the database purely to authenticate an HTTP call. Rotating it means setting it here and updating the matching Vault secret below.

The function signs its own ES256 provider JWT from these and reuses it for 50 minutes; Apple rejects a provider that re-signs more often than roughly hourly with `TooManyProviderTokenUpdates`.

It sends to `api.push.apple.com` and retries on `api.sandbox.push.apple.com` when Apple answers `BadDeviceToken`, so a device running a debug build and a device on TestFlight are both reachable without a second setting.

### Deploy the function

```sh
assist run supabase:functions
```

### Vault secrets

The webhook trigger reads the function's URL and `NOTIFY_DEVICES_SECRET` from Vault, because a migration is in git and the secret is not. Seed them once in the **SQL editor**, which is the only route: `vault.create_secret` is executable by `supabase_admin`, `postgres` and `service_role`, and the Management API query endpoint behind `scripts/db-query.sh` connects as `supabase_read_only_user` whatever `read_only` is set to, so it fails with "permission denied for function create_secret".

```sql
select vault.create_secret(
  'https://<project ref>.supabase.co/functions/v1/notify-devices',
  'notify_devices_url'
);
select vault.create_secret('<the NOTIFY_DEVICES_SECRET value>', 'notify_devices_secret');
```

Replace a value later with `select vault.update_secret('<id>', '<new value>')`, the id coming from `select id, name from vault.secrets`.

Until both exist the trigger logs `notify-devices is not configured` and sends nothing, which is also what a local `supabase start` does — no local database posts a household's writes at the production project.
