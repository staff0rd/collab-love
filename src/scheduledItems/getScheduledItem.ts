import { supabase } from "../lib/supabaseClient.ts";

import {
  mapScheduledItemRow,
  SCHEDULED_ITEM_COLUMNS,
  type ScheduledItem,
  type ScheduledItemRow,
} from "./getScheduledItems.ts";

export const getScheduledItem = async (id: string): Promise<ScheduledItem | null> => {
  const { data, error } = await supabase
    .from("scheduled_items")
    .select(SCHEDULED_ITEM_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) {
    throw error;
  }
  if (!data) {
    return null;
  }

  return mapScheduledItemRow(data as ScheduledItemRow);
};
