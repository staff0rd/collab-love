import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { createFeatureRequest } from "./createFeatureRequest.ts";
import type { FeatureRequest } from "./getFeatureRequests.ts";
import { updateFeatureRequest } from "./updateFeatureRequest.ts";
import { featureRequestsQueryKey } from "./useFeatureRequests.ts";

export type FeatureRequestFormState = ReturnType<typeof useFeatureRequestForm>;

const SAVE_ERROR = "Could not save the request. Please try again.";

export const useFeatureRequestForm = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const mutation = useMutation({
    mutationFn: () => {
      const values = { description: description.trim(), title: title.trim() };
      if (editingId) {
        return updateFeatureRequest(editingId, values);
      }
      return createFeatureRequest(values);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: featureRequestsQueryKey });
      setEditingId(null);
      setTitle("");
      setDescription("");
      onSuccess();
    },
  });

  const resetTo = (item: FeatureRequest | null) => {
    mutation.reset();
    setEditingId(item?.id ?? null);
    setTitle(item?.title ?? "");
    setDescription(item?.description ?? "");
  };

  let error: string | null = null;
  if (mutation.isError) {
    error = SAVE_ERROR;
  }

  return {
    canSave: title.trim() !== "" && description.trim() !== "" && !mutation.isPending,
    description,
    error,
    handleSave: () => mutation.mutate(),
    isEditing: editingId !== null,
    load: (item: FeatureRequest) => resetTo(item),
    reset: () => resetTo(null),
    setDescription,
    setTitle,
    title,
  };
};
