import { supabase } from "../lib/supabaseClient.ts";

export const scheduledItemsQueryKey = ["scheduledItems"] as const;

export type Recurrence = "once" | "daily" | "weekly" | "monthly" | "yearly";

export type LastAction = "bumped";

export type ScheduledItem = {
  id: string;
  title: string;
  scheduledAt: string;
  notes: string | null;
  ownerUserId: string | null;
  recurrence: Recurrence;
  recurrenceInterval: number | null;
  lastCompletedOccurrence: string | null;
  bumpedTo: string | null;
  lastAction: LastAction | null;
  reminderDaysBefore: number | null;
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string;
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
  bumped_to: string | null;
  last_action: LastAction | null;
  reminder_days_before: number | null;
  created_by: string;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
};

export const SCHEDULED_ITEM_COLUMNS =
  "id, title, scheduled_at, notes, owner_user_id, recurrence, recurrence_interval, last_completed_occurrence, bumped_to, last_action, reminder_days_before, created_by, created_at, updated_by, updated_at";

export const mapScheduledItemRow = (row: ScheduledItemRow): ScheduledItem => ({
  bumpedTo: row.bumped_to,
  createdAt: row.created_at,
  createdBy: row.created_by,
  id: row.id,
  lastAction: row.last_action,
  lastCompletedOccurrence: row.last_completed_occurrence,
  notes: row.notes,
  ownerUserId: row.owner_user_id,
  recurrence: row.recurrence,
  recurrenceInterval: row.recurrence_interval,
  reminderDaysBefore: row.reminder_days_before,
  scheduledAt: row.scheduled_at,
  title: row.title,
  updatedAt: row.updated_at,
  updatedBy: row.updated_by,
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
