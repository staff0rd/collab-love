import { supabase } from "../lib/supabaseClient.ts";

import type { ScheduledItem } from "./getScheduledItems.ts";
import { nextOccurrence, occurrenceDayValue } from "./nextOccurrence.ts";

export const completeScheduledItem = async (item: ScheduledItem, now: Date): Promise<void> => {
  const { error } = await supabase
    .from("scheduled_items")
    .update({ last_completed_occurrence: occurrenceDayValue(nextOccurrence(item, now)) })
    .eq("id", item.id);
  if (error) {
    throw error;
  }
};
