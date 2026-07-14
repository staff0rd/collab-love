# supabase

## Schema changes require prior agreement

Any and all changes to the database schema — new migrations, altering or dropping
tables/columns/constraints/policies, or otherwise modifying structure under
`migrations/` — must be discussed and agreed with the user first. Do not write or
apply a migration until the user has confirmed the approach. This applies even
when a schema change seems obvious or is implied by another task.
