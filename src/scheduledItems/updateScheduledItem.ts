import { supabase } from "../lib/supabaseClient.ts";

import type { NewScheduledItem } from "./createScheduledItem.ts";

export const updateScheduledItem = async (id: string, item: NewScheduledItem): Promise<void> => {
  const { error } = await supabase
    .from("scheduled_items")
    .update({
      notes: item.notes,
      owner: item.owner,
      scheduled_at: item.scheduledAt,
      title: item.title,
    })
    .eq("id", id);
  if (error) {
    throw error;
  }
};
