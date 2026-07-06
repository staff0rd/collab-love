# collab-love

A private app for the two of us — my wife and me — to run the shared logistics of life and love in one place: the appointments, recurring chores, seasonal checks, and reminders that are easy to drop when they only live in one person's head.

It runs on both our phones (installed via TestFlight, auto-updating) and as a web app from the same codebase.

## Who it's for

Just us two. It is not a general-purpose product — it is a small, trusted, shared space for a household of two people. Data is private to our household.

## What it does

At its heart it answers one question when either of us opens it: **what's coming up, and who's it for?**

Everything in the app is a **scheduled item** — something that happens on a specific date or on a recurring schedule, owned by one of us or shared between us. Real examples this is built around:

- **Medical appointments** — one-off, on a date.
- **Dog groom** — recurring every 6 weeks on a Monday morning.
- **Store annual sales** — yearly, so we buy at the efficient time.
- **Check windows for mold** — yearly, around June.
- **Pest control** — twice a year.
- **Wardrobe check** — before winter and before summer, to confirm my wife (who has sensory needs) has suitable clothes for the season ahead.
- **Medication** — taken daily; the hard part is weekends when the work routine doesn't carry it, so we want a nudge and a way to confirm it was taken (e.g. "did you take your medication, 12:30pm Saturday?").
- **Bins out** — every Sunday, but *which* bin rotates week to week.

## Core ideas

- **Shared visibility, targeted notifications.** Both of us see every item. But an item has an owner: I put the bins out, so my wife can see it's coming but only *I* get the nudge. Some items (like the wardrobe check) are for both of us.
- **One-off and recurring.** Items happen once on a date, or repeat — weekly, every N weeks on a weekday, yearly, twice a year, or seasonally ("before winter").
- **Rotating detail.** Some recurring items keep the same schedule but a detail cycles — the bin that goes out changes each week.
- **Configurable reminders.** Notifications are per-item and per-person, and some items (like medication) can be acknowledged — tap to confirm it's done, and both of us can see it was.
- **Know what's new.** When one of us adds something, the other sees an indicator so nothing added silently gets missed.

## Tech stack

| Concern | Choice |
| --- | --- |
| App | [Ionic](https://ionicframework.com/) + [Capacitor](https://capacitorjs.com/) + TypeScript — one codebase, native iOS + installable web |
| Backend & sync | [Supabase](https://supabase.com/) — Postgres, realtime sync, row-level security |
| Auth | Sign in with Apple (native sheet on iOS, OAuth redirect on web) |
| Reminders | On-device local notifications (Capacitor Local Notifications) |
| Distribution | GitHub Actions → TestFlight (iOS) + web deploy, auto-updating on push to `main` |

### Why these

- **Ionic + Capacitor** gives us one TypeScript codebase that ships as a real iOS app *and* a web app — matching "iOS now, web too" without maintaining two projects.
- **Supabase** handles the two things a two-device app needs — a shared source of truth that syncs in realtime, and per-user access control — with a clean JS SDK that works in both the native shell and the browser.
- **Sign in with Apple** is one tap on our iPhones and gives each of us a stable identity, which is what makes "only notify the owner" work.
- **Local notifications** fire reliably, offline, at no server cost, and "only I get notified of my bin day" falls out naturally because each phone schedules its own owner's reminders.

## Architecture at a glance

```
┌─────────────┐        ┌─────────────┐
│  iPhone A   │        │  iPhone B   │   (+ web app, same build)
│ Ionic/Capac.│        │ Ionic/Capac.│
│  local      │        │  local      │
│  notifs     │        │  notifs     │
└──────┬──────┘        └──────┬──────┘
       │   realtime sync + auth │
       └──────────┬─────────────┘
                  ▼
          ┌───────────────┐
          │   Supabase    │
          │  Postgres+RLS │
          │  Apple auth   │
          └───────────────┘
```

Each device schedules its owner's reminders locally. Shared item data lives in Supabase and syncs in realtime to both devices.

## Distribution

Push to `main` triggers GitHub Actions to build and upload a new iOS build to TestFlight (auto-installing on both our phones) and deploy the latest web build.

## Roadmap

The full backlog lives in `assist backlog` (`assist backlog list`). Planned work:

**Foundations**
- [ ] App scaffold (Ionic + Capacitor + TypeScript)
- [ ] CI/CD → TestFlight auto-distribution
- [ ] Auth: Sign in with Apple (native + web)

**Core data & views**
- [ ] Scheduled items: create / edit / delete
- [ ] Home "what's coming up" screen
- [ ] Recurrence engine
- [ ] Rotating detail on recurring items
- [ ] Assignment & visibility

**Sync & notifications**
- [ ] Realtime sync across devices
- [ ] Local notification reminders
- [ ] Reminder acknowledgement / check-off
- [ ] Per-user notification preferences

**Collaboration**
- [ ] Partner activity & "new items" indicator
- [ ] Categories / tags

**Extended**
- [ ] Apple Calendar sync
