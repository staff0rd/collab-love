import { supabase } from "../lib/supabaseClient.ts";

import type { ScheduledItem } from "./getScheduledItems.ts";

export const getScheduledItem = async (id: string): Promise<ScheduledItem | null> => {
  const { data, error } = await supabase
    .from("scheduled_items")
    .select("id, title, scheduled_at, notes, owner")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    throw error;
  }
  if (!data) {
    return null;
  }

  return {
    id: data.id,
    notes: data.notes,
    owner: data.owner,
    scheduledAt: data.scheduled_at,
    title: data.title,
  };
};
