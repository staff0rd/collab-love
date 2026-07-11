import { supabase } from "../lib/supabaseClient.ts";

export type NewFeatureRequest = {
  title: string;
  description: string;
};

const featureRequestToRow = (item: NewFeatureRequest) => ({
  description: item.description,
  title: item.title,
});

export const createFeatureRequest = async (item: NewFeatureRequest): Promise<void> => {
  const { error } = await supabase.from("feature_requests").insert(featureRequestToRow(item));
  if (error) {
    throw error;
  }
};
