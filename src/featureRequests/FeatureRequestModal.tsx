import { type FormEvent, useEffect } from "react";

import { Button } from "@/components/ui/button.tsx";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet.tsx";

import FeatureRequestFields from "./FeatureRequestFields.tsx";
import type { FeatureRequest } from "./getFeatureRequests.ts";
import { useFeatureRequestForm } from "./useFeatureRequestForm.ts";

type FeatureRequestModalProps = {
  isOpen: boolean;
  item: FeatureRequest | null;
  onClose: () => void;
  onSaved?: () => void;
};

const FeatureRequestModal = ({ isOpen, item, onClose, onSaved }: FeatureRequestModalProps) => {
  const form = useFeatureRequestForm(() => {
    onSaved?.();
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
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{heading}</SheetTitle>
          <SheetDescription>
            Capture something your household should build so it doesn&apos;t get lost.
          </SheetDescription>
        </SheetHeader>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <SheetBody className="flex flex-col gap-4">
            <FeatureRequestFields form={form} />

            {form.error && (
              <p role="alert" className="text-sm text-destructive">
                {form.error}
              </p>
            )}
          </SheetBody>

          <SheetFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!form.canSave}>
              Save
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default FeatureRequestModal;
