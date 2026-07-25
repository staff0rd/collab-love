-- Records what the most recent update to a row was, so the partner activity feed
-- can show a bump distinctly instead of as a generic change. Null means an
-- ordinary change; the bump paths set 'bumped' and every other write resets it,
-- so a later edit or completion downgrades the entry back to "changed".
alter table public.scheduled_items
  add column last_action text;

alter table public.scheduled_items
  add constraint scheduled_items_last_action_check
  check (last_action is null or last_action = 'bumped');
