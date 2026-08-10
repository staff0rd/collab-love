-- Household-wide daily pain log: one row per household per calendar day, with a
-- level and an extra-medication flag for each of the three fixed check-ins
-- (8:00am, 12:30pm, 8:00pm). Every reading is nullable, so a day with no entries
-- reads exactly like a day that was never opened, and a missed slot never blocks
-- a later one.
--
-- log_date has no default: now()::date on the server is UTC, which rolls over
-- mid-evening in Adelaide, so the client supplies its own local calendar day.
create table public.pain_logs (
  household_id uuid not null default public.current_household_id()
    references public.households (id) on delete cascade,
  log_date date not null,
  morning_level smallint,
  morning_extra_med boolean,
  midday_level smallint,
  midday_extra_med boolean,
  evening_level smallint,
  evening_extra_med boolean,
  created_by uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid()
    references auth.users (id) on delete set null,
  primary key (household_id, log_date)
);

alter table public.pain_logs
  add constraint pain_logs_morning_level_check check (morning_level between 0 and 10),
  add constraint pain_logs_midday_level_check check (midday_level between 0 and 10),
  add constraint pain_logs_evening_level_check check (evening_level between 0 and 10);

alter table public.pain_logs enable row level security;

create policy "Members can view household pain logs"
  on public.pain_logs for select
  to authenticated
  using (household_id = public.current_household_id());

create policy "Members can add household pain logs"
  on public.pain_logs for insert
  to authenticated
  with check (household_id = public.current_household_id());

create policy "Members can edit household pain logs"
  on public.pain_logs for update
  to authenticated
  using (household_id = public.current_household_id())
  with check (household_id = public.current_household_id());

create trigger pain_logs_set_updated
  before update on public.pain_logs
  for each row execute function public.set_row_updated();

-- Tables are not auto-exposed to the Data API roles, so grant the authenticated
-- role the table-level privileges its policies allow (see 20260710215000). No
-- delete: clearing a slot nulls its two columns rather than removing the row.
grant select, insert, update on public.pain_logs to authenticated;
