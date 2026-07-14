-- Completion state for scheduled items. Records the day of the most recently
-- completed occurrence so a recurring item's active occurrence is a pure
-- function of (anchor, recurrence_interval, now, last_completed_occurrence):
-- an un-actioned occurrence stays visible (and rolls into Overdue once its day
-- passes) instead of silently jumping to the next cycle, and marking it done
-- advances past today to the next occurrence.
alter table public.scheduled_items
  add column last_completed_occurrence date;
