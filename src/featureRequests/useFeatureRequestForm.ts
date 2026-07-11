import { useState } from "react";

import { createFeatureRequest } from "./createFeatureRequest.ts";
import type { FeatureRequest } from "./getFeatureRequests.ts";
import { updateFeatureRequest } from "./updateFeatureRequest.ts";

export type FeatureRequestFormState = ReturnType<typeof useFeatureRequestForm>;

export const useFeatureRequestForm = (onSuccess: () => void) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetTo = (item: FeatureRequest | null) => {
    setEditingId(item?.id ?? null);
    setTitle(item?.title ?? "");
    setDescription(item?.description ?? "");
    setSaving(false);
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const values = { description: description.trim(), title: title.trim() };
    try {
      if (editingId) {
        await updateFeatureRequest(editingId, values);
      } else {
        await createFeatureRequest(values);
      }
      onSuccess();
    } catch {
      setError("Could not save the request. Please try again.");
      setSaving(false);
    }
  };

  return {
    canSave: title.trim() !== "" && description.trim() !== "" && !saving,
    description,
    error,
    handleSave,
    isEditing: editingId !== null,
    load: (item: FeatureRequest) => resetTo(item),
    reset: () => resetTo(null),
    setDescription,
    setTitle,
    title,
  };
};
