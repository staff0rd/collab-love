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
- `[auth]` `site_url` / `additional_redirect_urls` allow-list the web origin
  (`http://localhost:5173` for local dev; add deployed origins here too). The app calls
  `signInWithOAuth` with `redirectTo` set to `window.location.origin`, so every origin
  must be listed.

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

Trigger it on demand from the **Actions** tab → **Rotate Apple client secret** → **Run
workflow**. (A monthly `schedule` trigger is added in phase 2.)

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
