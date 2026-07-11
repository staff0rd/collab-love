import { supabase } from "../lib/supabaseClient.ts";

export const deleteFeatureRequest = async (id: string): Promise<void> => {
  const { error } = await supabase.from("feature_requests").delete().eq("id", id);
  if (error) {
    throw error;
  }
};
