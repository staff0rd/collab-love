import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";
import { nextOccurrence } from "../scheduledItems/nextOccurrence.ts";
import { reminderTitle } from "../scheduledItems/scheduledItemEntries.ts";

import { eventRecurrenceRule } from "./eventRecurrenceRule.ts";

const EVENT_DURATION_MS = 3_600_000;
const MS_PER_DAY = 86_400_000;

const EVENT_URL_PREFIX = "collab-love://scheduled-item/";

export type DesiredEvent = {
  calendarId: string;
  description: string | undefined;
  endDate: number;
  recurrence: ReturnType<typeof eventRecurrenceRule>;
  startDate: number;
  title: string;
  url: string;
};

export type DesiredEntry = { event: DesiredEvent; key: string };

export const desiredEntriesFor = (
  item: ScheduledItem,
  now: Date,
  calendarId: string,
): DesiredEntry[] => {
  const recurrence = eventRecurrenceRule(item);
  const entryAt = (key: string, startDate: number, title: string): DesiredEntry => ({
    event: {
      calendarId,
      description: item.notes ?? undefined,
      endDate: startDate + EVENT_DURATION_MS,
      recurrence,
      startDate,
      title,
      url: EVENT_URL_PREFIX + key,
    },
    key,
  });
  const startDate = nextOccurrence(item, now).getTime();
  const entries: DesiredEntry[] = [entryAt(item.id, startDate, item.title)];
  if (item.reminderDaysBefore !== null) {
    const reminderStart = startDate - item.reminderDaysBefore * MS_PER_DAY;
    entries.push(
      entryAt(
        `${item.id}:reminder`,
        reminderStart,
        reminderTitle(item.reminderDaysBefore, item.title),
      ),
    );
  }
  return entries;
};

export const keyFromEventUrl = (url: string | null): string | null => {
  if (url !== null && url.startsWith(EVENT_URL_PREFIX)) {
    return url.slice(EVENT_URL_PREFIX.length);
  }
  return null;
};

export const fingerprintOf = (event: DesiredEvent): string =>
  JSON.stringify([
    event.calendarId,
    event.title,
    event.description ?? "",
    event.startDate,
    event.recurrence ?? null,
  ]);
