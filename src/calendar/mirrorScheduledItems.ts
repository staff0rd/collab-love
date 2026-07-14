import { CapacitorCalendar, EventSpan } from "@ebarooni/capacitor-calendar";

import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";
import { nextOccurrence } from "../scheduledItems/nextOccurrence.ts";

import {
  type CalendarEventMap,
  getCalendarEventMap,
  setCalendarEventMap,
} from "./calendarEventStore.ts";
import { eventRecurrenceRule } from "./eventRecurrenceRule.ts";
import { hasCalendarAccess } from "./requestCalendarAccess.ts";

const EVENT_DURATION_MS = 3_600_000;

type DesiredEvent = ReturnType<typeof desiredEventFor>;

const desiredEventFor = (item: ScheduledItem, now: Date) => {
  const startDate = nextOccurrence(item, now).getTime();
  return {
    description: item.notes ?? undefined,
    endDate: startDate + EVENT_DURATION_MS,
    recurrence: eventRecurrenceRule(item),
    startDate,
    title: item.title,
  };
};

const fingerprintOf = (event: DesiredEvent): string =>
  JSON.stringify([event.title, event.description ?? "", event.startDate, event.recurrence ?? null]);

const deleteEvent = async (eventId: string): Promise<void> => {
  await CapacitorCalendar.deleteEvent({ id: eventId, span: EventSpan.THIS_AND_FUTURE_EVENTS });
};

const upsertEvent = async (
  item: ScheduledItem,
  existing: CalendarEventMap,
  now: Date,
): Promise<CalendarEventMap[string]> => {
  const event = desiredEventFor(item, now);
  const fingerprint = fingerprintOf(event);
  const mirrored = existing[item.id];
  if (mirrored && mirrored.fingerprint === fingerprint) {
    return mirrored;
  }
  if (mirrored) {
    await deleteEvent(mirrored.eventId);
  }
  const { id } = await CapacitorCalendar.createEvent(event);
  return { eventId: id, fingerprint };
};

const deleteRemovedEvents = async (
  existing: CalendarEventMap,
  next: CalendarEventMap,
): Promise<void> => {
  for (const [itemId, mirrored] of Object.entries(existing)) {
    if (!next[itemId]) {
      await deleteEvent(mirrored.eventId);
    }
  }
};

export const clearMirroredEvents = async (): Promise<void> => {
  if (!(await hasCalendarAccess())) {
    return;
  }
  const existing = await getCalendarEventMap();
  for (const mirrored of Object.values(existing)) {
    await deleteEvent(mirrored.eventId);
  }
  await setCalendarEventMap({});
};

export const mirrorScheduledItems = async (items: ScheduledItem[]): Promise<void> => {
  if (!(await hasCalendarAccess())) {
    return;
  }

  const now = new Date();
  const existing = await getCalendarEventMap();
  const next: CalendarEventMap = {};

  for (const item of items) {
    next[item.id] = await upsertEvent(item, existing, now);
  }
  await deleteRemovedEvents(existing, next);
  await setCalendarEventMap(next);
};
