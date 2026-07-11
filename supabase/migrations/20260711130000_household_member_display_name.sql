alter table public.household_members
  add column display_name text;

create policy "Members can update their own profile"
  on public.household_members for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Column-scoped grant: members may edit only their own display_name, never
-- reassign their user_id or household_id. Row scoping is enforced by the policy
-- above; the column list here bounds which columns the update may touch.
grant update (display_name) on public.household_members to authenticated;
