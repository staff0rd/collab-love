import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

import {
  createEventsTracked,
  deleteEventsTracked,
  type MirrorSummary,
  type ProgressReporter,
  requireCalendar,
  summaryFor,
} from "./calendarEventOps.ts";
import { getCalendarEventMap, setCalendarEventMap } from "./calendarEventStore.ts";
import { desiredEntriesFor } from "./desiredCalendarEntries.ts";
import { scanCalendarEvents, scanWindow, staleEventIds } from "./ownedCalendarEvents.ts";

export const resyncMirror = async (
  items: ScheduledItem[],
  report: ProgressReporter,
): Promise<MirrorSummary> => {
  const calendar = await requireCalendar();
  const now = new Date();
  const entries = items.flatMap((item) => desiredEntriesFor(item, now, calendar.id));
  report({ done: 0, phase: "scanning", total: 0 });
  const events = await scanCalendarEvents(scanWindow(entries, now));
  const ownedTitles = new Set(entries.map((entry) => entry.event.title));
  const stale = staleEventIds(events, calendar.id, {
    existing: await getCalendarEventMap(),
    ownedTitles,
  });
  await deleteEventsTracked(stale, report);
  await setCalendarEventMap(await createEventsTracked(entries, report));
  return summaryFor(calendar, entries.length, items.length);
};
