-- owner was free text with no reliable mapping to a user. Replace it with a
-- structured reference to a household member; null = shared (both). Existing
-- rows have no reliable mapping, so they reset to shared (early-stage, low data).
-- on delete set null keeps an item as shared if its owner is removed.
alter table public.scheduled_items
  drop column owner;

alter table public.scheduled_items
  add column owner_user_id uuid references auth.users (id) on delete set null;

-- The existing table-level grant on scheduled_items (see
-- 20260710215000_grant_data_api_access.sql) already covers this new column.
