import { useMutation, useQueryClient } from "@tanstack/react-query";

import { completeScheduledItem } from "./completeScheduledItem.ts";
import type { ScheduledItem } from "./getScheduledItems.ts";
import { scheduledItemsQueryKey } from "./useScheduledItems.ts";

export const useCompleteScheduledItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: ScheduledItem) => completeScheduledItem(item, new Date()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: scheduledItemsQueryKey }),
  });
};
