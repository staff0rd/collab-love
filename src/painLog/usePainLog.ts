import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../auth/useAuth.ts";

import { getPainLog, NO_PAIN_READINGS, painLogQueryKey } from "./getPainLog.ts";

export const usePainLog = (logDate: string) => {
  const { session } = useAuth();
  const { data, error, isPending } = useQuery({
    enabled: session !== null,
    queryFn: () => getPainLog(logDate),
    queryKey: painLogQueryKey(logDate),
  });

  return { error, loading: isPending, readings: data ?? NO_PAIN_READINGS };
};
