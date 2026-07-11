import { supabase } from "../lib/supabaseClient.ts";

export type FeatureRequestStatus = "new" | "triaged" | "done";

export type FeatureRequest = {
  id: string;
  title: string;
  description: string;
  status: FeatureRequestStatus;
  createdAt: string;
};

type FeatureRequestRow = {
  id: string;
  title: string;
  description: string;
  status: FeatureRequestStatus;
  created_at: string;
};

const FEATURE_REQUEST_COLUMNS = "id, title, description, status, created_at";

const mapFeatureRequestRow = (row: FeatureRequestRow): FeatureRequest => ({
  createdAt: row.created_at,
  description: row.description,
  id: row.id,
  status: row.status,
  title: row.title,
});

export const getFeatureRequests = async (): Promise<FeatureRequest[]> => {
  const { data, error } = await supabase
    .from("feature_requests")
    .select(FEATURE_REQUEST_COLUMNS)
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }

  return (data as FeatureRequestRow[]).map(mapFeatureRequestRow);
};
