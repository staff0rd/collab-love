import { useEffect } from "react";

import FormSheet from "../components/FormSheet.tsx";
import { useHousehold } from "../household/useHousehold.ts";

import type { ScheduledItem } from "./getScheduledItems.ts";
import ScheduledItemFields from "./ScheduledItemFields.tsx";
import { useScheduledItemForm } from "./useScheduledItemForm.ts";

type ScheduledItemModalProps = {
  isOpen: boolean;
  item: ScheduledItem | null;
  onClose: () => void;
  onSaved?: () => void;
};

const ScheduledItemModal = ({ isOpen, item, onClose, onSaved }: ScheduledItemModalProps) => {
  const form = useScheduledItemForm(() => {
    onSaved?.();
    onClose();
  });
  const { household } = useHousehold();

  useEffect(() => {
    if (isOpen) {
      if (item) {
        form.load(item);
      } else {
        form.reset();
      }
    }
  }, [isOpen, item]);

  let heading = "New item";
  if (form.isEditing) {
    heading = "Edit item";
  }

  return (
    <FormSheet
      isOpen={isOpen}
      title={heading}
      description="Schedule something for your household to see what's coming up."
      error={form.error}
      canSave={form.canSave}
      onSave={form.handleSave}
      onClose={onClose}
    >
      <ScheduledItemFields form={form} members={household?.members ?? []} />
    </FormSheet>
  );
};

export default ScheduledItemModal;
