create table public.scheduled_items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null default public.current_household_id()
    references public.households (id) on delete cascade,
  title text not null,
  scheduled_at timestamptz not null,
  notes text,
  owner text,
  created_by uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.scheduled_items enable row level security;

create policy "Members can view household scheduled items"
  on public.scheduled_items for select
  to authenticated
  using (household_id = public.current_household_id());

create policy "Members can add household scheduled items"
  on public.scheduled_items for insert
  to authenticated
  with check (household_id = public.current_household_id());
