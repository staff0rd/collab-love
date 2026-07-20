import { type CalendarEvent, CapacitorCalendar } from "@ebarooni/capacitor-calendar";

import type { CalendarEventMap } from "./calendarEventStore.ts";
import { type DesiredEntry, keyFromEventUrl } from "./desiredCalendarEntries.ts";

const DAY_MS = 86_400_000;

export type ScanWindow = { from: number; to: number };

export const scanWindow = (entries: DesiredEntry[], now: Date): ScanWindow => {
  const times = entries.map((entry) => entry.event.startDate);
  return {
    from: Math.min(now.getTime(), ...times) - DAY_MS,
    to: Math.max(now.getTime(), ...times) + DAY_MS,
  };
};

export const scanCalendarEvents = async ({ from, to }: ScanWindow): Promise<CalendarEvent[]> => {
  const { result } = await CapacitorCalendar.listEventsInRange({ from, to });
  return result;
};

const inCalendar = (events: CalendarEvent[], calendarId: string): CalendarEvent[] =>
  events.filter((event) => event.calendarId === calendarId);

export const ownedEventIdsByKey = (
  events: CalendarEvent[],
  calendarId: string,
): Map<string, Set<string>> => {
  const byKey = new Map<string, Set<string>>();
  for (const event of inCalendar(events, calendarId)) {
    const key = keyFromEventUrl(event.url);
    if (key !== null) {
      const ids = byKey.get(key) ?? new Set<string>();
      ids.add(event.id);
      byKey.set(key, ids);
    }
  }
  return byKey;
};

const purgeableEventIds = (
  events: CalendarEvent[],
  calendarId: string,
  ownedTitles: Set<string>,
): Set<string> => {
  const owned = inCalendar(events, calendarId).filter(
    (event) => keyFromEventUrl(event.url) !== null || ownedTitles.has(event.title),
  );
  return new Set(owned.map((event) => event.id));
};

export const staleEventIds = (
  events: CalendarEvent[],
  calendarId: string,
  tracked: { existing: CalendarEventMap; ownedTitles: Set<string> },
): string[] => {
  const ids = purgeableEventIds(events, calendarId, tracked.ownedTitles);
  for (const mirrored of Object.values(tracked.existing)) {
    ids.add(mirrored.eventId);
  }
  return [...ids];
};
