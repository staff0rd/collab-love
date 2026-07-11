import type { FeatureRequestStatus } from "./getFeatureRequests.ts";

export const FEATURE_REQUEST_STATUS_LABELS: Record<FeatureRequestStatus, string> = {
  done: "Done",
  new: "New",
  triaged: "Triaged",
};

export const FEATURE_REQUEST_STATUS_STYLES: Record<FeatureRequestStatus, string> = {
  done: "bg-primary/10 text-primary",
  new: "bg-secondary text-secondary-foreground",
  triaged: "bg-accent text-accent-foreground",
};

export const NEXT_FEATURE_REQUEST_STATUS: Record<
  FeatureRequestStatus,
  FeatureRequestStatus | null
> = {
  done: null,
  new: "triaged",
  triaged: "done",
};
