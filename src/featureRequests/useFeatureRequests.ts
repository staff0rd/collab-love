import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../auth/useAuth.ts";

import { getFeatureRequests, featureRequestsQueryKey } from "./getFeatureRequests.ts";

export { featureRequestsQueryKey };

export const useFeatureRequests = () => {
  const { session } = useAuth();
  const { data, isPending, isError } = useQuery({
    enabled: session !== null,
    queryFn: getFeatureRequests,
    queryKey: featureRequestsQueryKey,
  });

  return { error: isError, items: data ?? [], loading: isPending };
};
