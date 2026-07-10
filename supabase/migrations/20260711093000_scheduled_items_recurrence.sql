-- Recurrence for scheduled items. scheduled_at remains the anchor occurrence
-- (authoritative time-of-day, and weekday/month-day for repeating rules); the
-- next occurrence is computed client-side from the anchor plus these columns.
alter table public.scheduled_items
  add column recurrence text not null default 'once',
  add column recurrence_interval integer;

alter table public.scheduled_items
  add constraint scheduled_items_recurrence_check
  check (
    recurrence in (
      'once', 'weekly', 'yearly', 'half-yearly', 'before-winter', 'before-summer'
    )
  );

-- recurrence_interval (weeks between occurrences) applies only to weekly rules.
alter table public.scheduled_items
  add constraint scheduled_items_recurrence_interval_check
  check (
    case
      when recurrence = 'weekly' then recurrence_interval >= 1
      else recurrence_interval is null
    end
  );
