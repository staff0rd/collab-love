-- Add 'daily' recurrence: a day-cadence rule (every N days). Extends the
-- recurrence check to accept it and the interval check to require interval >= 1
-- for daily, matching weekly/monthly.
alter table public.scheduled_items
  drop constraint scheduled_items_recurrence_check;

alter table public.scheduled_items
  add constraint scheduled_items_recurrence_check
  check (recurrence in ('once', 'daily', 'weekly', 'monthly', 'yearly'));

alter table public.scheduled_items
  drop constraint scheduled_items_recurrence_interval_check;

alter table public.scheduled_items
  add constraint scheduled_items_recurrence_interval_check
  check (
    case
      when recurrence in ('daily', 'weekly', 'monthly') then recurrence_interval >= 1
      else recurrence_interval is null
    end
  );
