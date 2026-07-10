import { supabase } from "../lib/supabaseClient.ts";

export type NewScheduledItem = {
  title: string;
  scheduledAt: string;
  notes: string | null;
  owner: string | null;
};

export const createScheduledItem = async (item: NewScheduledItem): Promise<void> => {
  const { error } = await supabase.from("scheduled_items").insert({
    notes: item.notes,
    owner: item.owner,
    scheduled_at: item.scheduledAt,
    title: item.title,
  });
  if (error) {
    throw error;
  }
};
