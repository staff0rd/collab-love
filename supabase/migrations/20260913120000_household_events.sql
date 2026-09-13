-- An append-only record of every change to household data, so a row's past can be
-- read rather than inferred. scheduled_items carried only updated_at/updated_by
-- (20260720120000), so a bump overwrote scheduled_at, bumped_to and
-- last_completed_occurrence with nothing left of what they had been: working out
-- why a date came out wrong meant redoing the arithmetic by hand. The partner
-- activity feed is no substitute, being derived from the current row rather than
-- from a history of changes.
--
-- Written by a trigger rather than by the client, so no write path can skip it,
-- and read through SQL only (scripts/db-query.sh). There is no app surface.
create table public.household_events (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  table_name text not null,
  row_id uuid not null,
  op text not null,
  actor uuid,
  occurred_at timestamptz not null default now(),
  old_row jsonb,
  new_row jsonb,
  intent jsonb
);

-- row_id and actor deliberately carry no foreign key. The log exists to outlive
-- what it describes, and either an on delete cascade or an on delete set null
-- would erase a row's (or a person's) history at exactly the moment it becomes
-- worth reading.
alter table public.household_events
  add constraint household_events_op_check
  check (op in ('insert', 'update', 'delete'));

-- The shape of the question this table exists to answer: what happened to this
-- one row, most recent first.
create index household_events_row_history_idx
  on public.household_events (household_id, table_name, row_id, occurred_at desc);

alter table public.household_events enable row level security;

create policy "Members can view household events"
  on public.household_events for select
  to authenticated
  using (household_id = public.current_household_id());

-- Select and nothing else, with no insert/update/delete policy to pair with a
-- write grant: a member reads their own household's history and has no route to
-- append to it or rewrite it. The trigger function below is security definer and
-- owned by the migration role, so it bypasses RLS to do the appending. Grants are
-- needed at all because tables are not auto-exposed to the Data API roles
-- (see 20260710215000).
grant select on public.household_events to authenticated;

-- A trigger sees the row, not the reasoning behind the write: a bump and an
-- ordinary edit both arrive as "scheduled_at changed". last_intent is what the app
-- decided -- the action, the bump scope, the target date it computed, and the
-- device's local now and time zone, none of which the server can recover, running
-- in UTC. Every client write sets it explicitly, to a value or to null, so an
-- earlier intent is never attributed to a later edit.
alter table public.scheduled_items
  add column last_intent jsonb;

-- One function serves every covered table: household_id, the primary key and
-- last_intent are read out of the row as jsonb instead of being named as columns,
-- so covering another table takes a trigger and nothing else.
create function public.log_household_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  old_data jsonb := case when tg_op = 'INSERT' then null else to_jsonb(old) end;
  new_data jsonb := case when tg_op = 'DELETE' then null else to_jsonb(new) end;
  row_data jsonb := coalesce(new_data, old_data);
begin
  insert into public.household_events (
    household_id, table_name, row_id, op, actor, old_row, new_row, intent
  )
  values (
    (row_data ->> 'household_id')::uuid,
    tg_table_name,
    (row_data ->> 'id')::uuid,
    lower(tg_op),
    auth.uid(),
    -- last_intent belongs to the event, not to the row snapshots. Left in place it
    -- would appear twice on the event that carries it, and old_row would advertise
    -- the *previous* write's intent, which is the mis-attribution this column
    -- exists to prevent.
    old_data - 'last_intent',
    new_data - 'last_intent',
    -- to_jsonb renders a SQL NULL column as JSON null, so without the nullif an
    -- absent intent would be stored as the jsonb literal null and read as present.
    -- A delete carries no intent of its own, and lifting the old row's would credit
    -- the deletion to whatever wrote the row last.
    case
      when tg_op = 'DELETE' then null
      else nullif(new_data -> 'last_intent', 'null'::jsonb)
    end
  );
  return null;
end;
$$;

-- After, not before, so the row is final: set_row_updated has already stamped
-- updated_at and updated_by by this point and they are captured with the rest.
create trigger scheduled_items_log_event
  after insert or update or delete on public.scheduled_items
  for each row execute function public.log_household_event();
