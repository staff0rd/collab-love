import { CapacitorCalendar, EventSpan } from "@ebarooni/capacitor-calendar";

import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";
import { nextOccurrence } from "../scheduledItems/nextOccurrence.ts";

import {
  type CalendarEventMap,
  getCalendarEventMap,
  setCalendarEventMap,
} from "./calendarEventStore.ts";
import { eventRecurrenceRule } from "./eventRecurrenceRule.ts";
import { resolveCalendarId } from "./resolveCalendarId.ts";

const EVENT_DURATION_MS = 3_600_000;

const desiredEventFor = (item: ScheduledItem, now: Date, calendarId: string) => {
  const startDate = nextOccurrence(item, now).getTime();
  return {
    calendarId,
    description: item.notes ?? undefined,
    endDate: startDate + EVENT_DURATION_MS,
    recurrence: eventRecurrenceRule(item),
    startDate,
    title: item.title,
  };
};

type DesiredEvent = ReturnType<typeof desiredEventFor>;

const fingerprintOf = (event: DesiredEvent): string =>
  JSON.stringify([event.title, event.description ?? "", event.startDate, event.recurrence ?? null]);

const deleteEvent = async (eventId: string): Promise<void> => {
  await CapacitorCalendar.deleteEvent({ id: eventId, span: EventSpan.THIS_AND_FUTURE_EVENTS });
};

type ReconcileContext = {
  calendarId: string;
  existing: CalendarEventMap;
  now: Date;
};

const upsertEvent = async (
  item: ScheduledItem,
  { calendarId, existing, now }: ReconcileContext,
): Promise<CalendarEventMap[string]> => {
  const event = desiredEventFor(item, now, calendarId);
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

const reconcile = async (items: ScheduledItem[]): Promise<void> => {
  const calendarId = await resolveCalendarId();
  if (!calendarId) {
    throw new Error("No writable calendar is available to sync into.");
  }

  const context: ReconcileContext = {
    calendarId,
    existing: await getCalendarEventMap(),
    now: new Date(),
  };
  const next: CalendarEventMap = {};

  for (const item of items) {
    next[item.id] = await upsertEvent(item, context);
  }
  await deleteRemovedEvents(context.existing, next);
  await setCalendarEventMap(next);
};

const clear = async (): Promise<void> => {
  const existing = await getCalendarEventMap();
  for (const mirrored of Object.values(existing)) {
    await deleteEvent(mirrored.eventId);
  }
  await setCalendarEventMap({});
};

let pending: Promise<unknown> = Promise.resolve();

const enqueue = <Result>(task: () => Promise<Result>): Promise<Result> => {
  const run = pending.then(task, task);
  pending = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
};

export const mirrorScheduledItems = (items: ScheduledItem[]): Promise<void> =>
  enqueue(() => reconcile(items));

export const clearMirroredEvents = (): Promise<void> => enqueue(clear);
