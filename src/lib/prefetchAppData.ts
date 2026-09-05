import type { QueryClient } from "@tanstack/react-query";

import {
  featureRequestsQueryKey,
  getFeatureRequests,
} from "../featureRequests/getFeatureRequests.ts";
import { getHousehold, householdQueryKey } from "../household/getHousehold.ts";
import { getMigraineLog, migraineLogQueryKey } from "../migraineLog/getMigraineLog.ts";
import { getPainLog, painLogQueryKey } from "../painLog/getPainLog.ts";
import { getScheduledItems, scheduledItemsQueryKey } from "../scheduledItems/getScheduledItems.ts";

import { addDays } from "./dateMath.ts";
import { localDayValue } from "./localDayValue.ts";

const PREVIOUS_DAY = -1;

export const prefetchAppData = (queryClient: QueryClient) => {
  const now = new Date();
  const today = localDayValue(now);
  const yesterday = localDayValue(addDays(now, PREVIOUS_DAY));

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
  void queryClient.prefetchQuery({
    queryFn: () => getPainLog(yesterday),
    queryKey: painLogQueryKey(yesterday),
  });
  void queryClient.prefetchQuery({
    queryFn: () => getMigraineLog(today),
    queryKey: migraineLogQueryKey(today),
  });
};
