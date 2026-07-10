import { supabase } from "../lib/supabaseClient.ts";

import { type NewScheduledItem, scheduledItemToRow } from "./createScheduledItem.ts";

export const updateScheduledItem = async (id: string, item: NewScheduledItem): Promise<void> => {
  const { error } = await supabase
    .from("scheduled_items")
    .update(scheduledItemToRow(item))
    .eq("id", id);
  if (error) {
    throw error;
  }
};
