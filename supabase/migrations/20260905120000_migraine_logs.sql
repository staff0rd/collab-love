-- Household-wide weekday migraine log: one row per household per calendar day,
-- recording whether you exercised, whether a migraine stopped you working, and
-- which medication you took. Every answer is nullable and three-valued: null is
-- "never answered", which is not the same as an answer of false, so a skipped
-- day stays visibly unrecorded rather than reading as a clear day.
--
-- A day counts as recorded once exercised and migraine are both non-null;
-- medication is optional and never holds a day open.
--
-- log_date has no default, for the same reason as pain_logs (see 20260810120000):
-- now()::date on the server is UTC, which rolls over mid-evening in Adelaide, so
-- the client supplies its own local calendar day.
create table public.migraine_logs (
  household_id uuid not null default public.current_household_id()
    references public.households (id) on delete cascade,
  log_date date not null,
  exercised boolean,
  migraine boolean,
  took_aspirin boolean,
  took_codeine boolean,
  created_by uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid()
    references auth.users (id) on delete set null,
  primary key (household_id, log_date)
);

alter table public.migraine_logs enable row level security;

create policy "Members can view household migraine logs"
  on public.migraine_logs for select
  to authenticated
  using (household_id = public.current_household_id());

create policy "Members can add household migraine logs"
  on public.migraine_logs for insert
  to authenticated
  with check (household_id = public.current_household_id());

create policy "Members can edit household migraine logs"
  on public.migraine_logs for update
  to authenticated
  using (household_id = public.current_household_id())
  with check (household_id = public.current_household_id());

create trigger migraine_logs_set_updated
  before update on public.migraine_logs
  for each row execute function public.set_row_updated();

-- Tables are not auto-exposed to the Data API roles, so grant the authenticated
-- role the table-level privileges its policies allow (see 20260710215000). No
-- delete: unanswering a question nulls its column rather than removing the row.
grant select, insert, update on public.migraine_logs to authenticated;

-- Realtime, so an entry recorded by one member appears on the other's card
-- without a manual refresh. As with pain_logs, the default replica identity is
-- enough: household_id is part of the primary key, so it is always logged for
-- the old row and the select policy can be evaluated against it.
alter publication supabase_realtime add table public.migraine_logs;
