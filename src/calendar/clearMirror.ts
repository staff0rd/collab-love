import type { Calendar } from "@ebarooni/capacitor-calendar";

import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

import { deleteEventsTracked, type ProgressReporter } from "./calendarEventOps.ts";
import {
  type CalendarEventMap,
  getCalendarEventMap,
  setCalendarEventMap,
} from "./calendarEventStore.ts";
import { desiredEntriesFor } from "./desiredCalendarEntries.ts";
import { scanCalendarEvents, scanWindow, staleEventIds } from "./ownedCalendarEvents.ts";
import { resolveCalendar } from "./resolveCalendar.ts";

const clearableEventIds = async (
  calendar: Calendar | undefined,
  items: ScheduledItem[],
  existing: CalendarEventMap,
): Promise<string[]> => {
  if (!calendar) {
    return Object.values(existing).map((mirrored) => mirrored.eventId);
  }
  const now = new Date();
  const entries = items.flatMap((item) => desiredEntriesFor(item, now, calendar.id));
  const events = await scanCalendarEvents(scanWindow(entries, now));
  const ownedTitles = new Set(entries.map((entry) => entry.event.title));
  return staleEventIds(events, calendar.id, { existing, ownedTitles });
};

export const clearMirror = async (
  items: ScheduledItem[],
  report: ProgressReporter,
): Promise<void> => {
  const calendar = await resolveCalendar();
  const existing = await getCalendarEventMap();
  await deleteEventsTracked(await clearableEventIds(calendar, items, existing), report);
  await setCalendarEventMap({});
};
