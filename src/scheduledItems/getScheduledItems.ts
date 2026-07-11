import { supabase } from "../lib/supabaseClient.ts";

export type Recurrence = "once" | "weekly" | "monthly" | "yearly";

export type ScheduledItem = {
  id: string;
  title: string;
  scheduledAt: string;
  notes: string | null;
  owner: string | null;
  recurrence: Recurrence;
  recurrenceInterval: number | null;
};

export type ScheduledItemRow = {
  id: string;
  title: string;
  scheduled_at: string;
  notes: string | null;
  owner: string | null;
  recurrence: Recurrence;
  recurrence_interval: number | null;
};

export const SCHEDULED_ITEM_COLUMNS =
  "id, title, scheduled_at, notes, owner, recurrence, recurrence_interval";

export const mapScheduledItemRow = (row: ScheduledItemRow): ScheduledItem => ({
  id: row.id,
  notes: row.notes,
  owner: row.owner,
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
