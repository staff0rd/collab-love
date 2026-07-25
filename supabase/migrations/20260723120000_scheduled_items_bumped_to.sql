-- A recurring item's displayed date normally comes from scheduled_at + cadence +
-- last_completed_occurrence. bumped_to overrides just the current occurrence so a
-- single instance can be pushed out without touching the anchor or cadence.
-- Cleared on the next normal edit or completion.
alter table public.scheduled_items
  add column bumped_to timestamptz;
