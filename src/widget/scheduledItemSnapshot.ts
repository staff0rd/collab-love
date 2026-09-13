import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";
import { isResolved } from "../scheduledItems/isResolved.ts";
import { scheduledItemEntries } from "../scheduledItems/scheduledItemEntries.ts";

const MS_PER_DAY = 86_400_000;

const SNAPSHOT_HORIZON_DAYS = 14;
const SNAPSHOT_VERSION = 1;

type ScheduledItemSnapshotEntry = {
  key: string;
  itemId: string;
  title: string;
  occurrence: number;
};

export type ScheduledItemSnapshot = {
  version: number;
  generatedAt: number;
  entries: ScheduledItemSnapshotEntry[];
};

const isVisibleToWidget = (item: ScheduledItem, userId: string): boolean =>
  item.ownerUserId === null || item.ownerUserId === userId;

export const scheduledItemSnapshot = (
  items: ScheduledItem[],
  userId: string,
  now: Date,
): ScheduledItemSnapshot => {
  const horizon = now.getTime() + SNAPSHOT_HORIZON_DAYS * MS_PER_DAY;
  const entries = items
    .filter((item) => isVisibleToWidget(item, userId) && !isResolved(item))
    .flatMap((item) => scheduledItemEntries(item, now))
    .map((entry) => ({
      itemId: entry.item.id,
      key: entry.key,
      occurrence: entry.occurrence.getTime(),
      title: entry.title,
    }))
    .filter((entry) => entry.occurrence <= horizon)
    .sort((left, right) => left.occurrence - right.occurrence);

  return { entries, generatedAt: now.getTime(), version: SNAPSHOT_VERSION };
};
