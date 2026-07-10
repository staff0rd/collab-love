import { useState } from "react";

import { createScheduledItem, type NewScheduledItem } from "./createScheduledItem.ts";
import type { ScheduledItem } from "./getScheduledItems.ts";
import { updateScheduledItem } from "./updateScheduledItem.ts";

const trimmedOrNull = (value: string) => {
  const trimmed = value.trim();
  if (trimmed === "") {
    return null;
  }
  return trimmed;
};

const persist = (editingId: string | null, values: NewScheduledItem) => {
  if (editingId === null) {
    return createScheduledItem(values);
  }
  return updateScheduledItem(editingId, values);
};

export type ScheduledItemFormState = ReturnType<typeof useScheduledItemForm>;

export const useScheduledItemForm = (onSuccess: () => void) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");
  const [owner, setOwner] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetTo = (item: ScheduledItem | null) => {
    setEditingId(item?.id ?? null);
    setTitle(item?.title ?? "");
    setScheduledAt(item?.scheduledAt ?? "");
    setNotes(item?.notes ?? "");
    setOwner(item?.owner ?? "");
    setSaving(false);
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await persist(editingId, {
        notes: trimmedOrNull(notes),
        owner: trimmedOrNull(owner),
        scheduledAt,
        title: title.trim(),
      });
      resetTo(null);
      onSuccess();
    } catch {
      setError("Could not save the item. Please try again.");
      setSaving(false);
    }
  };

  return {
    canSave: title.trim() !== "" && scheduledAt !== "" && !saving,
    error,
    handleSave,
    isEditing: editingId !== null,
    load: (item: ScheduledItem) => resetTo(item),
    notes,
    owner,
    reset: () => resetTo(null),
    scheduledAt,
    setNotes,
    setOwner,
    setScheduledAt,
    setTitle,
    title,
  };
};
