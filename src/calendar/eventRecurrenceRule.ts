import type { CreateEventOptions } from "@ebarooni/capacitor-calendar";

import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

const DEFAULT_INTERVAL = 1;

type EventRecurrence = CreateEventOptions["recurrence"];

export const eventRecurrenceRule = (item: ScheduledItem): EventRecurrence => {
  const interval = Math.max(DEFAULT_INTERVAL, item.recurrenceInterval ?? DEFAULT_INTERVAL);
  if (item.recurrence === "daily") {
    return { frequency: "daily", interval };
  }
  if (item.recurrence === "weekly") {
    return { frequency: "weekly", interval };
  }
  if (item.recurrence === "monthly") {
    return { frequency: "monthly", interval };
  }
  if (item.recurrence === "yearly") {
    return { frequency: "yearly", interval: DEFAULT_INTERVAL };
  }
  return undefined;
};
