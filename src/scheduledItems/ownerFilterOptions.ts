import { type HouseholdMember, memberDisplayName } from "../household/getHousehold.ts";

import type { ScheduledItem } from "./getScheduledItems.ts";

export const ALL_FILTER_KEY = "all";
const SHARED_FILTER_KEY = "shared";

const ORDER_LEFT_FIRST = -1;
const ORDER_RIGHT_FIRST = 1;

export type OwnerFilterOption = {
  key: string;
  label: string;
  count: number;
  matches: (item: ScheduledItem) => boolean;
};

const countMatching = (items: ScheduledItem[], matches: (item: ScheduledItem) => boolean): number =>
  items.filter(matches).length;

const memberLabel = (member: HouseholdMember, currentUserId: string | null): string => {
  if (member.userId === currentUserId) {
    return "Mine";
  }
  return memberDisplayName(member);
};

const currentUserFirst =
  (currentUserId: string | null) =>
  (left: HouseholdMember, right: HouseholdMember): number => {
    if (left.userId === currentUserId) {
      return ORDER_LEFT_FIRST;
    }
    if (right.userId === currentUserId) {
      return ORDER_RIGHT_FIRST;
    }
    return left.userId.localeCompare(right.userId);
  };

export const ownerFilterOptions = (
  items: ScheduledItem[],
  members: HouseholdMember[],
  currentUserId: string | null,
): OwnerFilterOption[] => {
  const memberOptions = [...members]
    .sort(currentUserFirst(currentUserId))
    .map((member): OwnerFilterOption => {
      const matches = (item: ScheduledItem) => item.ownerUserId === member.userId;
      return {
        count: countMatching(items, matches),
        key: member.userId,
        label: memberLabel(member, currentUserId),
        matches,
      };
    });

  const sharedMatches = (item: ScheduledItem) => item.ownerUserId === null;

  return [
    { count: items.length, key: ALL_FILTER_KEY, label: "All", matches: () => true },
    ...memberOptions,
    {
      count: countMatching(items, sharedMatches),
      key: SHARED_FILTER_KEY,
      label: "Both",
      matches: sharedMatches,
    },
  ];
};
