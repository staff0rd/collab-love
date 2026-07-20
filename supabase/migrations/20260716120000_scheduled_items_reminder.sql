-- Optional reminder lead time: number of days before a scheduled item's
-- occurrence to surface an advance heads-up. Null means no reminder; when set
-- it must be >= 1 (a same-day reminder is just the item itself).
alter table public.scheduled_items
  add column reminder_days_before integer;

alter table public.scheduled_items
  add constraint scheduled_items_reminder_days_before_check
  check (reminder_days_before is null or reminder_days_before >= 1);
