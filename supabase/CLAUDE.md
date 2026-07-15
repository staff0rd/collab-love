# supabase

## Schema changes require prior agreement

Any and all changes to the database schema — new migrations, altering or dropping
tables/columns/constraints/policies, or otherwise modifying structure under
`migrations/` — must be discussed and agreed with the user first. Do not write or
apply a migration until the user has confirmed the approach. This applies even
when a schema change seems obvious or is implied by another task.

## Presenting a schema change for agreement

When proposing a table or its change, show it as a column table — not raw SQL and
not a unified diff. Use these columns: `Column`, `Type`, `Null?`, `Default`, `Notes`
(FKs, checks, and semantics go in Notes). Mark added/changed rows in bold and call
out what is new. Show the actual migration SQL only after the layout, as a follow-up.
