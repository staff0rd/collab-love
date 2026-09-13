import type { ScheduledItem } from "./getScheduledItems.ts";

export const isResolved = (item: ScheduledItem): boolean =>
  item.recurrence === "once" && item.lastCompletedOccurrence !== null;
