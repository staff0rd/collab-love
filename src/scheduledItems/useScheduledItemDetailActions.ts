import { useNavigate } from "react-router";

import type { BumpScope } from "./bumpScheduledItem.ts";
import type { ScheduledItem } from "./getScheduledItems.ts";
import type { SnoozeTarget } from "./snoozeTarget.ts";
import { useBumpScheduledItem } from "./useBumpScheduledItem.ts";
import { useCompleteScheduledItem } from "./useCompleteScheduledItem.ts";
import { useDeleteScheduledItem } from "./useDeleteScheduledItem.ts";

export const useScheduledItemDetailActions = (item: ScheduledItem | null) => {
  const navigate = useNavigate();
  const deleteMutation = useDeleteScheduledItem();
  const completeMutation = useCompleteScheduledItem();
  const bumpMutation = useBumpScheduledItem();
  const goHome = { onSuccess: () => void navigate("/home") };

  return {
    onBump: (target: SnoozeTarget, scope: BumpScope) =>
      item && bumpMutation.mutate({ item, scope, target }),
    onComplete: () => item && completeMutation.mutate(item, goHome),
    onDelete: () => item && deleteMutation.mutate(item.id, goHome),
  };
};
