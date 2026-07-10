import { supabase } from "../lib/supabaseClient.ts";

export const deleteScheduledItem = async (id: string): Promise<void> => {
  const { error } = await supabase.from("scheduled_items").delete().eq("id", id);
  if (error) {
    throw error;
  }
};
