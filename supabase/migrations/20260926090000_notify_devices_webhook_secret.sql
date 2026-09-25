-- The webhook proved itself to the edge function with the project's service role key,
-- which meant a credential that bypasses RLS on every table sat in the database purely to
-- authenticate an HTTP call. It also welded the check to a key type Supabase is retiring
-- in favour of sb_secret_ keys. Both go away with a secret that can do exactly one thing:
-- ask for a silent push. If it leaks, that is all it buys.
--
-- Only the secret's name changes here. The trigger, its when clause and the payload are
-- untouched.
create or replace function public.notify_devices_of_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  endpoint text;
  webhook_secret text;
begin
  select decrypted_secret into endpoint
    from vault.decrypted_secrets where name = 'notify_devices_url';
  select decrypted_secret into webhook_secret
    from vault.decrypted_secrets where name = 'notify_devices_secret';

  if endpoint is null or webhook_secret is null then
    raise warning 'notify-devices is not configured: seed the notify_devices_url and notify_devices_secret vault secrets';
    return null;
  end if;

  -- pg_net queues the request and returns its id immediately, so the write that
  -- triggered this is never held up by APNs, and a push that fails to send never
  -- rolls back the change it was announcing.
  perform net.http_post(
    url := endpoint,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || webhook_secret
    ),
    -- actor is the user who made the change, and the function skips their devices.
    -- It is nullable, and a null means nobody is skipped, which is the right answer
    -- for a write that no session owns.
    body := jsonb_build_object('household_id', new.household_id, 'actor', new.actor)
  );

  return null;
end;
$$;
