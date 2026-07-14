-- Enable Supabase realtime for scheduled_items so changes on one device appear
-- on the other without a manual refresh.

-- Realtime evaluates the SELECT RLS policy against the old row for DELETE
-- events. The policy keys on household_id, which is not in the default replica
-- identity (primary key only), so without this deletes would fail the check and
-- never be delivered to other household members. FULL logs every column of the
-- old row so the household_id check can pass.
alter table public.scheduled_items replica identity full;

alter publication supabase_realtime add table public.scheduled_items;
