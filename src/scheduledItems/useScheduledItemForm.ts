import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import type { Recurrence, ScheduledItem } from "./getScheduledItems.ts";
import {
  EMPTY_VALUES,
  type FormValues,
  persistScheduledItem,
  valuesFrom,
} from "./scheduledItemFormValues.ts";
import { scheduledItemsQueryKey } from "./useScheduledItems.ts";

export type ScheduledItemFormState = ReturnType<typeof useScheduledItemForm>;

const SAVE_ERROR = "Could not save the item. Please try again.";

export const useScheduledItemForm = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);

  const setField = <Key extends keyof FormValues>(key: Key, value: FormValues[Key]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const mutation = useMutation({
    mutationFn: () => persistScheduledItem(editingId, values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: scheduledItemsQueryKey });
      setEditingId(null);
      setValues(EMPTY_VALUES);
      onSuccess();
    },
  });

  const resetTo = (item: ScheduledItem | null) => {
    mutation.reset();
    setEditingId(item?.id ?? null);
    if (item) {
      setValues(valuesFrom(item));
    } else {
      setValues(EMPTY_VALUES);
    }
  };

  let error: string | null = null;
  if (mutation.isError) {
    error = SAVE_ERROR;
  }

  return {
    canSave: values.title.trim() !== "" && values.scheduledAt !== "" && !mutation.isPending,
    error,
    handleSave: () => mutation.mutate(),
    interval: values.interval,
    isEditing: editingId !== null,
    load: (item: ScheduledItem) => resetTo(item),
    notes: values.notes,
    ownerUserId: values.ownerUserId,
    recurrence: values.recurrence,
    reminderDaysBefore: values.reminderDaysBefore,
    reset: () => resetTo(null),
    scheduledAt: values.scheduledAt,
    setInterval: (value: number) => setField("interval", value),
    setNotes: (value: string) => setField("notes", value),
    setOwnerUserId: (value: string | null) => setField("ownerUserId", value),
    setRecurrence: (value: Recurrence) => setField("recurrence", value),
    setReminderDaysBefore: (value: number | null) => setField("reminderDaysBefore", value),
    setScheduledAt: (value: string) => setField("scheduledAt", value),
    setTitle: (value: string) => setField("title", value),
    title: values.title,
  };
};
