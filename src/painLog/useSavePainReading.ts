import { useMutation, useQueryClient } from "@tanstack/react-query";

import { painLogQueryKey } from "./getPainLog.ts";
import { savePainReading, type PainReadingWrite } from "./savePainReading.ts";

export const useSavePainReading = (logDate: string, onSaved: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (write: PainReadingWrite) => savePainReading(logDate, write),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: painLogQueryKey(logDate) });
      onSaved();
    },
  });
};
