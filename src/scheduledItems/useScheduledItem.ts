import { skipToken, useQuery, useQueryClient } from "@tanstack/react-query";

import { getScheduledItem } from "./getScheduledItem.ts";
import type { ScheduledItem } from "./getScheduledItems.ts";
import { scheduledItemsQueryKey } from "./useScheduledItems.ts";

export const scheduledItemQueryKey = (id: string) => ["scheduledItem", id];

const scheduledItemQueryFn = (id: string | undefined) => {
  if (!id) {
    return skipToken;
  }
  return () => getScheduledItem(id);
};

export const useScheduledItem = (id: string | undefined) => {
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    initialData: () => {
      if (!id) {
        return undefined;
      }
      const cached = queryClient.getQueryData<ScheduledItem[]>(scheduledItemsQueryKey);
      return cached?.find((item) => item.id === id);
    },
    queryFn: scheduledItemQueryFn(id),
    queryKey: ["scheduledItem", id],
  });

  return { item: data ?? null, loading: isPending };
};
