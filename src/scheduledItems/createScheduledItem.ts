import { supabase } from "../lib/supabaseClient.ts";
import type { Recurrence } from "./getScheduledItems.ts";

export type NewScheduledItem = {
  title: string;
  scheduledAt: string;
  notes: string | null;
  ownerUserId: string | null;
  recurrence: Recurrence;
  recurrenceInterval: number | null;
  reminderDaysBefore: number | null;
};

export const scheduledItemToRow = (item: NewScheduledItem) => ({
  notes: item.notes,
  owner_user_id: item.ownerUserId,
  recurrence: item.recurrence,
  recurrence_interval: item.recurrenceInterval,
  reminder_days_before: item.reminderDaysBefore,
  scheduled_at: item.scheduledAt,
  title: item.title,
});

export const createScheduledItem = async (item: NewScheduledItem): Promise<void> => {
  const { error } = await supabase.from("scheduled_items").insert(scheduledItemToRow(item));
  if (error) {
    throw error;
  }
};
