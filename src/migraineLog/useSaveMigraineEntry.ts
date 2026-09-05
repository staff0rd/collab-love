import { useMutation, useQueryClient } from "@tanstack/react-query";

import { migraineLogQueryKey, type MigraineEntry } from "./getMigraineLog.ts";
import { saveMigraineEntry } from "./saveMigraineEntry.ts";

const ONLY_THIS_SAVE = 1;

export const useSaveMigraineEntry = (logDate: string) => {
  const queryClient = useQueryClient();
  const queryKey = migraineLogQueryKey(logDate);
  const mutationKey = [...queryKey, "save"];

  const { mutate, isError } = useMutation({
    mutationFn: (entry: MigraineEntry) => saveMigraineEntry(logDate, entry),
    mutationKey,
    onMutate: async (entry: MigraineEntry) => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData(queryKey, entry);
    },
    onSettled: async () => {
      const lastSaveWins = queryClient.isMutating({ mutationKey }) === ONLY_THIS_SAVE;
      if (lastSaveWins) {
        await queryClient.invalidateQueries({ queryKey });
      }
    },
  });

  return { failed: isError, save: mutate };
};
