-- Tables are not auto-exposed to the Data API roles (config auto_expose_new_tables
-- is unset, matching the cloud default), so RLS policies alone are not enough:
-- the authenticated role also needs table-level privileges. Grant exactly the
-- operations each table's policies allow.
grant select, insert, update, delete on public.scheduled_items to authenticated;
grant select on public.households to authenticated;
grant select on public.household_members to authenticated;
