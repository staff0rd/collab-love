import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../auth/useAuth.ts";

import { getFeatureRequests, featureRequestsQueryKey } from "./getFeatureRequests.ts";

export { featureRequestsQueryKey };

export const useFeatureRequests = () => {
  const { session } = useAuth();
  const { data, isPending } = useQuery({
    enabled: session !== null,
    queryFn: getFeatureRequests,
    queryKey: featureRequestsQueryKey,
  });

  return { items: data ?? [], loading: isPending };
};
