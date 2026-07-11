-- Simplify recurrence to once/weekly/monthly/yearly. Drops the half-yearly and
-- seasonal (before-winter/before-summer) rules and adds monthly. Existing rows
-- on a dropped rule fall back to a one-off so the tightened check constraint
-- applies cleanly.
update public.scheduled_items
  set recurrence = 'once'
  where recurrence in ('half-yearly', 'before-winter', 'before-summer');

alter table public.scheduled_items
  drop constraint scheduled_items_recurrence_check;

alter table public.scheduled_items
  add constraint scheduled_items_recurrence_check
  check (recurrence in ('once', 'weekly', 'monthly', 'yearly'));

-- recurrence_interval now applies to both weekly and monthly rules.
alter table public.scheduled_items
  drop constraint scheduled_items_recurrence_interval_check;

alter table public.scheduled_items
  add constraint scheduled_items_recurrence_interval_check
  check (
    case
      when recurrence in ('weekly', 'monthly') then recurrence_interval >= 1
      else recurrence_interval is null
    end
  );
