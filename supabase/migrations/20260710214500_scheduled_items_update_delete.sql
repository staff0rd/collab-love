create policy "Members can edit household scheduled items"
  on public.scheduled_items for update
  to authenticated
  using (household_id = public.current_household_id())
  with check (household_id = public.current_household_id());

create policy "Members can delete household scheduled items"
  on public.scheduled_items for delete
  to authenticated
  using (household_id = public.current_household_id());
