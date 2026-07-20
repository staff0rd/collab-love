-- Track when a shared item was last changed and by whom, so a partner-activity
-- feed can attribute both additions (created_by) and changes (updated_by) across
-- the shared item types (scheduled_items and feature_requests).

-- now() is the transaction timestamp, so a fresh insert leaves updated_at exactly
-- equal to created_at; a later edit advances it. The trigger stamps both the time
-- and the actor on every update, overriding any client-supplied value.
create function public.set_row_updated()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

-- scheduled_items
alter table public.scheduled_items
  add column updated_at timestamptz,
  add column updated_by uuid references auth.users (id) on delete set null;

-- Backfill so pre-existing rows read as "never changed" (updated_at = created_at),
-- not as freshly edited.
update public.scheduled_items
  set updated_at = created_at,
      updated_by = created_by;

alter table public.scheduled_items
  alter column updated_at set not null,
  alter column updated_at set default now(),
  alter column updated_by set default auth.uid();

create trigger scheduled_items_set_updated
  before update on public.scheduled_items
  for each row execute function public.set_row_updated();

-- feature_requests
alter table public.feature_requests
  add column updated_at timestamptz,
  add column updated_by uuid references auth.users (id) on delete set null;

update public.feature_requests
  set updated_at = created_at,
      updated_by = created_by;

alter table public.feature_requests
  alter column updated_at set not null,
  alter column updated_at set default now(),
  alter column updated_by set default auth.uid();

create trigger feature_requests_set_updated
  before update on public.feature_requests
  for each row execute function public.set_row_updated();

-- updated_by is nullable with on delete set null so removing a user does not
-- cascade-delete items they only edited. The existing table-level grants on both
-- tables already cover the new columns.
