import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../auth/useAuth.ts";

import { getMigraineLog, migraineLogQueryKey, NO_MIGRAINE_ENTRY } from "./getMigraineLog.ts";

export const useMigraineLog = (logDate: string) => {
  const { session } = useAuth();
  const { data, error, isPending } = useQuery({
    enabled: session !== null,
    queryFn: () => getMigraineLog(logDate),
    queryKey: migraineLogQueryKey(logDate),
  });

  return { entry: data ?? NO_MIGRAINE_ENTRY, error, loading: isPending };
};
