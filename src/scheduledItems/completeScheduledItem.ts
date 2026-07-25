import { supabase } from "../lib/supabaseClient.ts";

import type { ScheduledItem } from "./getScheduledItems.ts";
import { nextOccurrence, occurrenceDayValue } from "./nextOccurrence.ts";

export const completeScheduledItem = async (item: ScheduledItem, now: Date): Promise<void> => {
  const naturalItem = { ...item, bumpedTo: null };
  const { error } = await supabase
    .from("scheduled_items")
    .update({
      bumped_to: null,
      last_completed_occurrence: occurrenceDayValue(nextOccurrence(naturalItem, now)),
    })
    .eq("id", item.id);
  if (error) {
    throw error;
  }
};
