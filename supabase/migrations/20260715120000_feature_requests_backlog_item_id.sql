-- Links a triaged feature request to the backlog item it produced. Null until
-- the request is triaged; used to make /triage-requests re-runs idempotent
-- (only rows where this is null are processed).
alter table public.feature_requests
  add column backlog_item_id text;
