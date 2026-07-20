import { supabase } from "../lib/supabaseClient.ts";

export const featureRequestsQueryKey = ["featureRequests"] as const;

export type FeatureRequestStatus = "new" | "triaged" | "done";

export type FeatureRequest = {
  id: string;
  title: string;
  description: string;
  status: FeatureRequestStatus;
  createdAt: string;
  createdBy: string;
  updatedBy: string | null;
  updatedAt: string;
};

type FeatureRequestRow = {
  id: string;
  title: string;
  description: string;
  status: FeatureRequestStatus;
  created_at: string;
  created_by: string;
  updated_by: string | null;
  updated_at: string;
};

const FEATURE_REQUEST_COLUMNS =
  "id, title, description, status, created_at, created_by, updated_by, updated_at";

const mapFeatureRequestRow = (row: FeatureRequestRow): FeatureRequest => ({
  createdAt: row.created_at,
  createdBy: row.created_by,
  description: row.description,
  id: row.id,
  status: row.status,
  title: row.title,
  updatedAt: row.updated_at,
  updatedBy: row.updated_by,
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
