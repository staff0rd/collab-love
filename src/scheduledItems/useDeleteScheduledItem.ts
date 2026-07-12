import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteScheduledItem } from "./deleteScheduledItem.ts";
import { scheduledItemsQueryKey } from "./useScheduledItems.ts";

export const useDeleteScheduledItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteScheduledItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: scheduledItemsQueryKey }),
  });
};
