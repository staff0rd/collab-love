import type { QueryClient } from "@tanstack/react-query";

import {
  featureRequestsQueryKey,
  getFeatureRequests,
} from "../featureRequests/getFeatureRequests.ts";
import { getHousehold, householdQueryKey } from "../household/getHousehold.ts";
import { getScheduledItems, scheduledItemsQueryKey } from "../scheduledItems/getScheduledItems.ts";

export const prefetchAppData = (queryClient: QueryClient) => {
  void queryClient.prefetchQuery({ queryFn: getScheduledItems, queryKey: scheduledItemsQueryKey });
  void queryClient.prefetchQuery({ queryFn: getHousehold, queryKey: householdQueryKey });
  void queryClient.prefetchQuery({
    queryFn: getFeatureRequests,
    queryKey: featureRequestsQueryKey,
  });
};
