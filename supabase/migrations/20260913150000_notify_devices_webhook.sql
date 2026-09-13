-- Fires the silent push that refreshes the other device's widget. The widget reads an
-- App Group snapshot only the app can write, and useHouseholdRealtime only closes that
-- gap while the app is running, so a change made here has to reach an app that is not.
--
-- Hung off household_events rather than scheduled_items because that log's trigger
-- already fires on every covered table with household_id, actor and op normalised, so
-- the function is handed a payload it does not have to reshape per table. Widening
-- beyond scheduled_items is then a change to the when clause below and nothing else.
create extension if not exists pg_net with schema extensions;

-- 20260913140000 granted device_tokens to authenticated only, and tables are not
-- auto-exposed to the Data API roles, so the edge function's read returned "permission
-- denied for table device_tokens" -- RLS is beside the point, service_role bypasses it.
-- Delete is granted alongside for the pruning of the tokens APNs reports as dead.
grant select, delete on public.device_tokens to service_role;

-- The endpoint and the service role key are read from Vault rather than written here:
-- a migration is in git and the key is not. See docs/supabase-setup.md for seeding them.
-- A database without them -- a local `supabase start`, a fresh branch -- sends nothing
-- and says so, rather than posting a household's writes at the production project.
create function public.notify_devices_of_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  endpoint text;
  service_key text;
begin
  select decrypted_secret into endpoint
    from vault.decrypted_secrets where name = 'notify_devices_url';
  select decrypted_secret into service_key
    from vault.decrypted_secrets where name = 'notify_devices_service_key';

  if endpoint is null or service_key is null then
    raise warning 'notify-devices is not configured: seed the notify_devices_url and notify_devices_service_key vault secrets';
    return null;
  end if;

  -- pg_net queues the request and returns its id immediately, so the write that
  -- triggered this is never held up by APNs, and a push that fails to send never
  -- rolls back the change it was announcing.
  perform net.http_post(
    url := endpoint,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    ),
    -- actor is the user who made the change, and the function skips their devices.
    -- It is nullable, and a null means nobody is skipped, which is the right answer
    -- for a write that no session owns.
    body := jsonb_build_object('household_id', new.household_id, 'actor', new.actor)
  );

  return null;
end;
$$;

revoke execute on function public.notify_devices_of_event() from public;

-- One push per changed row: every write in the app touches a single item, and a rare
-- bulk update sending a handful of identical wake-ups costs less than the bookkeeping
-- to coalesce them.
create trigger household_events_notify_devices
  after insert on public.household_events
  for each row
  when (new.table_name = 'scheduled_items')
  execute function public.notify_devices_of_event();
