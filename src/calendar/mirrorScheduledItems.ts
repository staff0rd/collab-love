import { CapacitorCalendar, EventSpan } from "@ebarooni/capacitor-calendar";

import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";
import { nextOccurrence } from "../scheduledItems/nextOccurrence.ts";

import {
  type CalendarEventMap,
  getCalendarEventMap,
  setCalendarEventMap,
} from "./calendarEventStore.ts";
import { eventRecurrenceRule } from "./eventRecurrenceRule.ts";
import { resolveCalendar } from "./resolveCalendar.ts";

const EVENT_DURATION_MS = 3_600_000;

export type MirrorSummary = {
  calendarId: string;
  calendarSource: string | null;
  calendarTitle: string;
  createdCount: number;
  itemCount: number;
};

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
  JSON.stringify([
    event.calendarId,
    event.title,
    event.description ?? "",
    event.startDate,
    event.recurrence ?? null,
  ]);

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
): Promise<{ created: boolean; entry: CalendarEventMap[string] }> => {
  const event = desiredEventFor(item, now, calendarId);
  const fingerprint = fingerprintOf(event);
  const mirrored = existing[item.id];
  if (mirrored && mirrored.fingerprint === fingerprint) {
    return { created: false, entry: mirrored };
  }
  if (mirrored) {
    await deleteEvent(mirrored.eventId);
  }
  const { id } = await CapacitorCalendar.createEvent(event);
  return { created: true, entry: { eventId: id, fingerprint } };
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

const applyItems = async (
  items: ScheduledItem[],
  context: ReconcileContext,
): Promise<{ createdIds: string[]; next: CalendarEventMap }> => {
  const next: CalendarEventMap = {};
  const createdIds: string[] = [];
  for (const item of items) {
    const { created, entry } = await upsertEvent(item, context);
    next[item.id] = entry;
    if (created) {
      createdIds.push(item.id);
    }
  }
  return { createdIds, next };
};

const reconcile = async (items: ScheduledItem[]): Promise<MirrorSummary> => {
  const calendar = await resolveCalendar();
  if (!calendar) {
    throw new Error("No writable calendar is available to sync into.");
  }

  const context: ReconcileContext = {
    calendarId: calendar.id,
    existing: await getCalendarEventMap(),
    now: new Date(),
  };
  const { createdIds, next } = await applyItems(items, context);
  await deleteRemovedEvents(context.existing, next);
  await setCalendarEventMap(next);

  return {
    calendarId: calendar.id,
    calendarSource: calendar.source?.title ?? null,
    calendarTitle: calendar.title,
    createdCount: createdIds.length,
    itemCount: items.length,
  };
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

export const mirrorScheduledItems = (items: ScheduledItem[]): Promise<MirrorSummary> =>
  enqueue(() => reconcile(items));

export const clearMirroredEvents = (): Promise<void> => enqueue(clear);
