import { supabase } from "../lib/supabaseClient.ts";

export const scheduledItemsQueryKey = ["scheduledItems"] as const;

export type Recurrence = "once" | "daily" | "weekly" | "monthly" | "yearly";

export type ScheduledItem = {
  id: string;
  title: string;
  scheduledAt: string;
  notes: string | null;
  ownerUserId: string | null;
  recurrence: Recurrence;
  recurrenceInterval: number | null;
  lastCompletedOccurrence: string | null;
  reminderDaysBefore: number | null;
};

export type ScheduledItemRow = {
  id: string;
  title: string;
  scheduled_at: string;
  notes: string | null;
  owner_user_id: string | null;
  recurrence: Recurrence;
  recurrence_interval: number | null;
  last_completed_occurrence: string | null;
  reminder_days_before: number | null;
};

export const SCHEDULED_ITEM_COLUMNS =
  "id, title, scheduled_at, notes, owner_user_id, recurrence, recurrence_interval, last_completed_occurrence, reminder_days_before";

export const mapScheduledItemRow = (row: ScheduledItemRow): ScheduledItem => ({
  id: row.id,
  lastCompletedOccurrence: row.last_completed_occurrence,
  notes: row.notes,
  ownerUserId: row.owner_user_id,
  recurrence: row.recurrence,
  recurrenceInterval: row.recurrence_interval,
  reminderDaysBefore: row.reminder_days_before,
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
