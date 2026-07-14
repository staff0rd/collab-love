import { useNavigate } from "react-router";

import type { ScheduledItem } from "./getScheduledItems.ts";
import { useCompleteScheduledItem } from "./useCompleteScheduledItem.ts";
import { useDeleteScheduledItem } from "./useDeleteScheduledItem.ts";

export const useScheduledItemDetailActions = (item: ScheduledItem | null) => {
  const navigate = useNavigate();
  const deleteMutation = useDeleteScheduledItem();
  const completeMutation = useCompleteScheduledItem();
  const goHome = { onSuccess: () => void navigate("/home") };

  return {
    onComplete: () => item && completeMutation.mutate(item, goHome),
    onDelete: () => item && deleteMutation.mutate(item.id, goHome),
  };
};
