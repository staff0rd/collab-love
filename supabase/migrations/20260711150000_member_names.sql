-- Names become per-viewer and private: each person labels the other member (and
-- themselves), and what one person calls another is never visible to anyone else.
-- This replaces the single shared display_name on household_members with a
-- viewer-scoped member_names table.

drop policy "Members can update their own profile" on public.household_members;

alter table public.household_members
  drop column display_name;

create table public.member_names (
  viewer_user_id uuid not null references auth.users (id) on delete cascade,
  subject_user_id uuid not null references auth.users (id) on delete cascade,
  household_id uuid not null references public.households (id) on delete cascade,
  display_name text not null,
  primary key (viewer_user_id, subject_user_id)
);

alter table public.member_names enable row level security;

-- A viewer can only see and edit the names they set. This viewer scoping is what
-- keeps each person's names private to their own login.
create policy "Viewers manage their own member names"
  on public.member_names for all
  to authenticated
  using (viewer_user_id = auth.uid())
  with check (viewer_user_id = auth.uid());

grant select, insert, update, delete on public.member_names to authenticated;
