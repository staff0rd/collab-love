-- Enable Supabase realtime for pain_logs so a reading recorded by one member
-- appears on the other's card without a manual refresh.

-- Unlike scheduled_items (see 20260714130000), the default replica identity is
-- enough here: household_id is part of the primary key, so it is always logged
-- for the old row and the household_id SELECT policy can be evaluated against
-- it. There is also no delete grant on this table, so only inserts and updates
-- are ever published.
alter publication supabase_realtime add table public.pain_logs;
