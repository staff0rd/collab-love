-- Extends the log of 20260913120000 to the remaining household data tables, and
-- caps what it keeps.
--
-- pain_logs and migraine_logs are keyed by (household_id, log_date), not by a
-- surrogate id, so the trigger function's row_data ->> 'id' finds nothing there
-- and row_id is not null. Rather than bolt an id column onto two tables that
-- already have a perfectly good natural key, row_id becomes the primary key
-- rendered as text and each trigger names the columns that make up that key. A
-- uuid renders as itself, so scheduled_items and feature_requests read exactly as
-- they did, and the two log tables read as household:date.
alter table public.household_events
  alter column row_id type text using row_id::text;

-- The question is "what happened to this row", and the row is identified by
-- table_name and row_id; household_id led the phase 1 index, which put the
-- selective columns second and third. Dropped in favour of the two shapes
-- actually queried: a row's history, and the prune's sweep by age.
drop index public.household_events_row_history_idx;

create index household_events_row_history_idx
  on public.household_events (table_name, row_id, occurred_at desc);

create index household_events_occurred_at_idx
  on public.household_events (occurred_at);

create or replace function public.log_household_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  old_data jsonb := case when tg_op = 'INSERT' then null else to_jsonb(old) end;
  new_data jsonb := case when tg_op = 'DELETE' then null else to_jsonb(new) end;
  row_data jsonb := coalesce(new_data, old_data);
  key_column text;
  key_parts text[] := '{}';
begin
  if tg_nargs = 0 then
    raise exception 'trigger % on % must name the primary key columns as arguments',
      tg_name, tg_table_name;
  end if;

  foreach key_column in array tg_argv loop
    -- A missing part would shorten the key rather than fail, quietly filing two
    -- different rows' events under one row_id -- the exact confusion this table
    -- exists to remove.
    if row_data ->> key_column is null then
      raise exception 'row of % has no value for key column %', tg_table_name, key_column;
    end if;
    key_parts := key_parts || (row_data ->> key_column);
  end loop;

  insert into public.household_events (
    household_id, table_name, row_id, op, actor, old_row, new_row, intent
  )
  values (
    (row_data ->> 'household_id')::uuid,
    tg_table_name,
    array_to_string(key_parts, ':'),
    lower(tg_op),
    auth.uid(),
    -- last_intent belongs to the event, not to the row snapshots. Left in place it
    -- would appear twice on the event that carries it, and old_row would advertise
    -- the *previous* write's intent, which is the mis-attribution that column
    -- exists to prevent. Only scheduled_items has one; on the other tables both
    -- operators are no-ops.
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

-- Recreated rather than left alone: the key columns are now part of the contract
-- and every covered table states them, so there is no default to be wrong about.
drop trigger scheduled_items_log_event on public.scheduled_items;

create trigger scheduled_items_log_event
  after insert or update or delete on public.scheduled_items
  for each row execute function public.log_household_event('id');

-- After, not before, so the row is final: set_row_updated has already stamped
-- updated_at and updated_by by this point and they are captured with the rest.
create trigger pain_logs_log_event
  after insert or update or delete on public.pain_logs
  for each row execute function public.log_household_event('household_id', 'log_date');

create trigger migraine_logs_log_event
  after insert or update or delete on public.migraine_logs
  for each row execute function public.log_household_event('household_id', 'log_date');

create trigger feature_requests_log_event
  after insert or update or delete on public.feature_requests
  for each row execute function public.log_household_event('id');

-- Retention lives here, beside the table, rather than in a CI job: the rule that
-- bounds the table belongs with its definition. Four weeks is the window in which
-- "why did it do that?" still gets asked; the nightly dump in db-backup.yml
-- carries the rest if it is ever wanted.
create extension if not exists pg_cron;

create function public.prune_household_events()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.household_events
  where occurred_at < now() - interval '4 weeks';
$$;

-- No grant to authenticated: members read their own history and have no route to
-- shorten it. The cron job runs as the owner, which is all that needs to call it.
revoke execute on function public.prune_household_events() from public;

-- 16:00 UTC, an hour behind the 15:00 backup in db-backup.yml, so the dump of the
-- day has already captured whatever this is about to remove.
select cron.schedule(
  'prune-household-events',
  '0 16 * * *',
  $$select public.prune_household_events()$$
);
