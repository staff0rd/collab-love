import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useAuth } from "../auth/useAuth.ts";

import { getMigraineLogRange, migraineLogRangeQueryKey } from "./getMigraineLogRange.ts";
import { migraineRangeDates, type MigraineRange } from "./migraineRanges.ts";

export const useMigraineLogRange = (range: MigraineRange, today: Date) => {
  const { session } = useAuth();
  const { from, to } = migraineRangeDates(range, today);
  const { data, error, isPending, isFetching } = useQuery({
    enabled: session !== null,
    placeholderData: keepPreviousData,
    queryFn: () => getMigraineLogRange(from, to),
    queryKey: migraineLogRangeQueryKey(from, to),
  });

  return { days: data ?? [], error, loading: isPending, refreshing: isFetching };
};
