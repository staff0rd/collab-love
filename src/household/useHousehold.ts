import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../auth/useAuth.ts";

import { getHousehold, householdQueryKey } from "./getHousehold.ts";

export const useHousehold = () => {
  const { session } = useAuth();
  const { data, isPending } = useQuery({
    enabled: session !== null,
    queryFn: getHousehold,
    queryKey: householdQueryKey,
  });

  return { household: data ?? null, loading: isPending };
};
