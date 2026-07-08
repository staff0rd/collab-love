create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table public.household_members (
  user_id uuid primary key references auth.users (id) on delete cascade,
  household_id uuid not null references public.households (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.households enable row level security;
alter table public.household_members enable row level security;

insert into public.households (id, name)
values ('00000000-0000-0000-0000-000000000001', 'Home');

create function public.current_household_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select household_id from public.household_members where user_id = auth.uid();
$$;

create function public.assign_to_household()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.household_members (user_id, household_id)
  values (new.id, '00000000-0000-0000-0000-000000000001')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.assign_to_household();

create policy "Members can view their household"
  on public.households for select
  to authenticated
  using (id = public.current_household_id());

create policy "Members can view household members"
  on public.household_members for select
  to authenticated
  using (household_id = public.current_household_id());
