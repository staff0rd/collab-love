import { supabase } from "../lib/supabaseClient.ts";

import type { FeatureRequestStatus } from "./getFeatureRequests.ts";

export type FeatureRequestPatch = {
  title?: string;
  description?: string;
  status?: FeatureRequestStatus;
};

export const updateFeatureRequest = async (
  id: string,
  patch: FeatureRequestPatch,
): Promise<void> => {
  const { error } = await supabase.from("feature_requests").update(patch).eq("id", id);
  if (error) {
    throw error;
  }
};
