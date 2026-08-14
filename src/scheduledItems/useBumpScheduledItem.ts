import { useMutation, useQueryClient } from "@tanstack/react-query";

import { bumpScheduledItem, type BumpScope } from "./bumpScheduledItem.ts";
import type { ScheduledItem } from "./getScheduledItems.ts";
import type { SnoozeTarget } from "./snoozeTarget.ts";
import { scheduledItemQueryKey } from "./useScheduledItem.ts";
import { scheduledItemsQueryKey } from "./useScheduledItems.ts";

type BumpVariables = { item: ScheduledItem; target: SnoozeTarget; scope: BumpScope };

export const useBumpScheduledItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ item, target, scope }: BumpVariables) =>
      bumpScheduledItem(item, { now: new Date(), scope, target }),
    onSuccess: (_result, { item }) => {
      void queryClient.invalidateQueries({ queryKey: scheduledItemsQueryKey });
      void queryClient.invalidateQueries({ queryKey: scheduledItemQueryKey(item.id) });
    },
  });
};
