-- The APNs device tokens a silent push is sent to. The widget reads an App Group
-- snapshot only the app can write, so a change made on one device does not reach
-- the other device's widget until that app is next foregrounded; a content-available
-- push wakes it long enough to rewrite the snapshot. Nothing can be sent without
-- knowing where to send it, which is what this table holds.
--
-- Keyed by (user_id, token) rather than by a surrogate id so re-registering the same
-- device upserts: iOS hands out the same token for the life of an install, and a
-- fresh row per launch would mean pushing to the same device repeatedly.
create table public.device_tokens (
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  token text not null,
  -- Denormalised from household_members so the sender can select a household's
  -- tokens in one read. It is a copy, so the trigger below keeps it honest rather
  -- than trusting whatever the client sends.
  household_id uuid not null references public.households (id) on delete cascade,
  platform text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, token)
);

alter table public.device_tokens
  add constraint device_tokens_platform_check check (platform in ('ios'));

-- The sender's question: every token in this household. The primary key leads with
-- user_id and cannot answer it.
create index device_tokens_household_idx on public.device_tokens (household_id);

-- household_id is not the client's to choose. Left to a column default it would be
-- right on insert and stale forever after; accepted from the client it would let a
-- member address pushes at a household they are not in. Stamping it on every write
-- makes it a true copy of the membership at the time of the write.
create function public.stamp_device_token()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.household_id := public.current_household_id();
  new.updated_at := now();
  return new;
end;
$$;

create trigger device_tokens_stamp
  before insert or update on public.device_tokens
  for each row execute function public.stamp_device_token();

alter table public.device_tokens enable row level security;

-- Own rows only, not the household: a member has no reason to read, move or delete
-- the token of the device in someone else's pocket. The edge function that sends the
-- pushes reads the household's tokens with the service role, which bypasses RLS.
create policy "Users can view their own device tokens"
  on public.device_tokens for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can add their own device tokens"
  on public.device_tokens for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can edit their own device tokens"
  on public.device_tokens for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can remove their own device tokens"
  on public.device_tokens for delete
  to authenticated
  using (user_id = auth.uid());

-- Tables are not auto-exposed to the Data API roles, so grant the authenticated role
-- the table-level privileges its policies allow (see 20260710215000). Delete included:
-- signing out takes the device's token with it.
grant select, insert, update, delete on public.device_tokens to authenticated;
