import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../auth/useAuth.ts";

import { getScheduledItems, scheduledItemsQueryKey } from "./getScheduledItems.ts";

export { scheduledItemsQueryKey };

export const useScheduledItems = () => {
  const { session } = useAuth();
  const { data, error, isPending } = useQuery({
    enabled: session !== null,
    queryFn: getScheduledItems,
    queryKey: scheduledItemsQueryKey,
  });

  return { error, items: data ?? [], loading: isPending };
};
