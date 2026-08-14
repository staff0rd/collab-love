import type { BumpScope } from "./bumpScheduledItem.ts";
import type { ScheduledItem } from "./getScheduledItems.ts";
import type { SnoozeTarget } from "./snoozeTarget.ts";
import { useBumpScheduledItem } from "./useBumpScheduledItem.ts";
import { useCompleteScheduledItem } from "./useCompleteScheduledItem.ts";
import { useDeleteScheduledItem } from "./useDeleteScheduledItem.ts";

export const useScheduledItemListActions = () => {
  const deleteMutation = useDeleteScheduledItem();
  const completeMutation = useCompleteScheduledItem();
  const bumpMutation = useBumpScheduledItem();

  return {
    onBump: (item: ScheduledItem, target: SnoozeTarget, scope: BumpScope) =>
      bumpMutation.mutate({ item, scope, target }),
    onComplete: (item: ScheduledItem) => completeMutation.mutate(item),
    onDelete: (item: ScheduledItem) => deleteMutation.mutate(item.id),
  };
};
