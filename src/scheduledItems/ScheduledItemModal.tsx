import { type FormEvent, useEffect } from "react";

import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";

import { useHousehold } from "../household/useHousehold.ts";

import type { ScheduledItem } from "./getScheduledItems.ts";
import ScheduledItemFields from "./ScheduledItemFields.tsx";
import { useScheduledItemForm } from "./useScheduledItemForm.ts";

type ScheduledItemModalProps = {
  isOpen: boolean;
  item: ScheduledItem | null;
  onClose: () => void;
  onSaved: () => void;
};

const ScheduledItemModal = ({ isOpen, item, onClose, onSaved }: ScheduledItemModalProps) => {
  const form = useScheduledItemForm(() => {
    onSaved();
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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void form.handleSave();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{heading}</DialogTitle>
          <DialogDescription>
            Schedule something for your household to see what&apos;s coming up.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <ScheduledItemFields form={form} members={household?.members ?? []} />

          {form.error && (
            <p role="alert" className="text-sm text-destructive">
              {form.error}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!form.canSave}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduledItemModal;
