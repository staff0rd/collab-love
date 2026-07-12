import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../auth/useAuth.ts";

import { getScheduledItems, scheduledItemsQueryKey } from "./getScheduledItems.ts";

export { scheduledItemsQueryKey };

export const useScheduledItems = () => {
  const { session } = useAuth();
  const { data, isPending } = useQuery({
    enabled: session !== null,
    queryFn: getScheduledItems,
    queryKey: scheduledItemsQueryKey,
  });

  return { items: data ?? [], loading: isPending };
};
