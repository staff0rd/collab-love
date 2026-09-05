import type { QueryClient } from "@tanstack/react-query";

import {
  featureRequestsQueryKey,
  getFeatureRequests,
} from "../featureRequests/getFeatureRequests.ts";
import { getHousehold, householdQueryKey } from "../household/getHousehold.ts";
import { getMigraineLog, migraineLogQueryKey } from "../migraineLog/getMigraineLog.ts";
import { previousWeekday } from "../migraineLog/weekdays.ts";
import { getPainLog, painLogQueryKey } from "../painLog/getPainLog.ts";
import { getScheduledItems, scheduledItemsQueryKey } from "../scheduledItems/getScheduledItems.ts";

import { addDays } from "./dateMath.ts";
import { localDayValue } from "./localDayValue.ts";

const PREVIOUS_DAY = -1;

const prefetchLogs = (queryClient: QueryClient, now: Date) => {
  const today = localDayValue(now);
  const yesterday = localDayValue(addDays(now, PREVIOUS_DAY));
  const lastWeekday = localDayValue(previousWeekday(now));

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
  void queryClient.prefetchQuery({
    queryFn: () => getMigraineLog(lastWeekday),
    queryKey: migraineLogQueryKey(lastWeekday),
  });
};

export const prefetchAppData = (queryClient: QueryClient) => {
  void queryClient.prefetchQuery({ queryFn: getScheduledItems, queryKey: scheduledItemsQueryKey });
  void queryClient.prefetchQuery({ queryFn: getHousehold, queryKey: householdQueryKey });
  void queryClient.prefetchQuery({
    queryFn: getFeatureRequests,
    queryKey: featureRequestsQueryKey,
  });
  prefetchLogs(queryClient, new Date());
};
