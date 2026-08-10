import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useAuth } from "../auth/useAuth.ts";

import { getPainLogRange, painLogRangeQueryKey } from "./getPainLogRange.ts";
import { painRangeDates, type PainRange } from "./painRanges.ts";

export const usePainLogRange = (range: PainRange, today: Date) => {
  const { session } = useAuth();
  const { from, to } = painRangeDates(range, today);
  const { data, error, isPending, isFetching } = useQuery({
    enabled: session !== null,
    placeholderData: keepPreviousData,
    queryFn: () => getPainLogRange(from, to),
    queryKey: painLogRangeQueryKey(from, to),
  });

  return { days: data ?? [], error, loading: isPending, refreshing: isFetching };
};
