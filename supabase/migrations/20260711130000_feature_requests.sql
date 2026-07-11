create table public.feature_requests (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null default public.current_household_id()
    references public.households (id) on delete cascade,
  title text not null,
  description text not null,
  status text not null default 'new',
  created_by uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.feature_requests
  add constraint feature_requests_status_check
  check (status in ('new', 'triaged', 'done'));

alter table public.feature_requests enable row level security;

create policy "Members can view household feature requests"
  on public.feature_requests for select
  to authenticated
  using (household_id = public.current_household_id());

create policy "Members can add household feature requests"
  on public.feature_requests for insert
  to authenticated
  with check (household_id = public.current_household_id());

create policy "Members can edit household feature requests"
  on public.feature_requests for update
  to authenticated
  using (household_id = public.current_household_id())
  with check (household_id = public.current_household_id());

create policy "Members can delete household feature requests"
  on public.feature_requests for delete
  to authenticated
  using (household_id = public.current_household_id());

-- Tables are not auto-exposed to the Data API roles, so grant the authenticated
-- role the table-level privileges its policies allow (see 20260710215000).
grant select, insert, update, delete on public.feature_requests to authenticated;
