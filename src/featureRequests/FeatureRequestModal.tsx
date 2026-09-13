import { useEffect } from "react";

import FormSheet from "../components/FormSheet.tsx";

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

  return (
    <FormSheet
      isOpen={isOpen}
      title={heading}
      description="Capture something your household should build so it doesn't get lost."
      error={form.error}
      canSave={form.canSave}
      onSave={form.handleSave}
      onClose={onClose}
    >
      <FeatureRequestFields form={form} />
    </FormSheet>
  );
};

export default FeatureRequestModal;
