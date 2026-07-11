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

import FeatureRequestFields from "./FeatureRequestFields.tsx";
import type { FeatureRequest } from "./getFeatureRequests.ts";
import { useFeatureRequestForm } from "./useFeatureRequestForm.ts";

type FeatureRequestModalProps = {
  isOpen: boolean;
  item: FeatureRequest | null;
  onClose: () => void;
  onSaved: () => void;
};

const FeatureRequestModal = ({ isOpen, item, onClose, onSaved }: FeatureRequestModalProps) => {
  const form = useFeatureRequestForm(() => {
    onSaved();
    onClose();
  });

  useEffect(() => {
    if (isOpen) {
      if (item) {
        form.load(item);
      } else {
        form.reset();
      }
    }
  }, [isOpen, item]);

  let heading = "New request";
  if (form.isEditing) {
    heading = "Edit request";
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
            Capture something your household should build so it doesn&apos;t get lost.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <FeatureRequestFields form={form} />

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

export default FeatureRequestModal;
