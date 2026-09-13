import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";

import { useHousehold } from "../household/useHousehold.ts";
import ScheduledItemModal from "../scheduledItems/ScheduledItemModal.tsx";
import { scheduledItemQueryKey, useScheduledItem } from "../scheduledItems/useScheduledItem.ts";
import { useScheduledItemDetailActions } from "../scheduledItems/useScheduledItemDetailActions.ts";
import { scheduledItemsQueryKey } from "../scheduledItems/useScheduledItems.ts";

import ScheduledItemDetailContent from "./ScheduledItemDetailContent.tsx";
import SubPage from "./SubPage.tsx";

const ScheduledItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { household } = useHousehold();
  const { item, loading } = useScheduledItem(id);
  const { onDelete, onComplete, onBump } = useScheduledItemDetailActions(item);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleSaved = () => {
    if (id) {
      void queryClient.invalidateQueries({ queryKey: scheduledItemQueryKey(id) });
    }
    void queryClient.invalidateQueries({ queryKey: scheduledItemsQueryKey });
  };

  return (
    <SubPage title="Item">
      <ScheduledItemDetailContent
        item={item}
        members={household?.members ?? []}
        loading={loading}
        onEdit={() => setIsEditOpen(true)}
        onDelete={onDelete}
        onComplete={onComplete}
        onBump={onBump}
      />

      {item && (
        <ScheduledItemModal
          isOpen={isEditOpen}
          item={item}
          onClose={() => setIsEditOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </SubPage>
  );
};

export default ScheduledItemDetail;
