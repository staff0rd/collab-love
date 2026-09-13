import type { BumpScope } from "./bumpScheduledItem.ts";
import type { ScheduledItem } from "./getScheduledItems.ts";
import type { SnoozeTarget } from "./snoozeTarget.ts";

export type ScheduledItemActionHandlers = {
  onEdit: (item: ScheduledItem) => void;
  onDelete: (item: ScheduledItem) => void;
  onComplete: (item: ScheduledItem) => void;
  onBump: (item: ScheduledItem, target: SnoozeTarget, scope: BumpScope) => void;
};
