import { useMemo, useState } from "react";

import type { HouseholdMember } from "../household/getHousehold.ts";

import type { ScheduledItem } from "./getScheduledItems.ts";
import {
  ALL_FILTER_KEY,
  ownerFilterOptions,
  type OwnerFilterOption,
} from "./ownerFilterOptions.ts";

const FIRST_OPTION = 0;

export type OwnerFilter = {
  options: OwnerFilterOption[];
  active: OwnerFilterOption;
  visibleItems: ScheduledItem[];
  select: (key: string) => void;
};

export const useOwnerFilter = (
  items: ScheduledItem[],
  members: HouseholdMember[] | undefined,
  currentUserId: string | null,
): OwnerFilter => {
  const [selected, setSelected] = useState(ALL_FILTER_KEY);
  const options = useMemo(
    () => ownerFilterOptions(items, members ?? [], currentUserId),
    [items, members, currentUserId],
  );
  const active = options.find((option) => option.key === selected) ?? options[FIRST_OPTION];
  const visibleItems = items.filter(active.matches);

  return { active, options, select: setSelected, visibleItems };
};
