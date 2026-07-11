import { supabase } from "../lib/supabaseClient.ts";

export type Recurrence = "once" | "weekly" | "monthly" | "yearly";

export type ScheduledItem = {
  id: string;
  title: string;
  scheduledAt: string;
  notes: string | null;
  ownerUserId: string | null;
  recurrence: Recurrence;
  recurrenceInterval: number | null;
};

export type ScheduledItemRow = {
  id: string;
  title: string;
  scheduled_at: string;
  notes: string | null;
  owner_user_id: string | null;
  recurrence: Recurrence;
  recurrence_interval: number | null;
};

export const SCHEDULED_ITEM_COLUMNS =
  "id, title, scheduled_at, notes, owner_user_id, recurrence, recurrence_interval";

export const mapScheduledItemRow = (row: ScheduledItemRow): ScheduledItem => ({
  id: row.id,
  notes: row.notes,
  ownerUserId: row.owner_user_id,
  recurrence: row.recurrence,
  recurrenceInterval: row.recurrence_interval,
  scheduledAt: row.scheduled_at,
  title: row.title,
});

export const getScheduledItems = async (): Promise<ScheduledItem[]> => {
  const { data, error } = await supabase
    .from("scheduled_items")
    .select(SCHEDULED_ITEM_COLUMNS)
    .order("scheduled_at", { ascending: true });
  if (error) {
    throw error;
  }

  return (data as ScheduledItemRow[]).map(mapScheduledItemRow);
};
