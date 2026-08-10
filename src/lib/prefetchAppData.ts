import type { QueryClient } from "@tanstack/react-query";

import {
  featureRequestsQueryKey,
  getFeatureRequests,
} from "../featureRequests/getFeatureRequests.ts";
import { getHousehold, householdQueryKey } from "../household/getHousehold.ts";
import { getPainLog, painLogQueryKey } from "../painLog/getPainLog.ts";
import { getScheduledItems, scheduledItemsQueryKey } from "../scheduledItems/getScheduledItems.ts";

import { localDayValue } from "./localDayValue.ts";

export const prefetchAppData = (queryClient: QueryClient) => {
  const today = localDayValue(new Date());

  void queryClient.prefetchQuery({ queryFn: getScheduledItems, queryKey: scheduledItemsQueryKey });
  void queryClient.prefetchQuery({ queryFn: getHousehold, queryKey: householdQueryKey });
  void queryClient.prefetchQuery({
    queryFn: getFeatureRequests,
    queryKey: featureRequestsQueryKey,
  });
  void queryClient.prefetchQuery({
    queryFn: () => getPainLog(today),
    queryKey: painLogQueryKey(today),
  });
};
