import { type Calendar, CapacitorCalendar, EventSpan } from "@ebarooni/capacitor-calendar";

import type { CalendarEventMap } from "./calendarEventStore.ts";
import { type DesiredEntry, fingerprintOf } from "./desiredCalendarEntries.ts";
import { resolveCalendar } from "./resolveCalendar.ts";

export type MirrorSummary = {
  calendarId: string;
  calendarSource: string | null;
  calendarTitle: string;
  createdCount: number;
  itemCount: number;
};

type MirrorPhase = "adding" | "removing" | "scanning";
export type MirrorProgress = { done: number; phase: MirrorPhase; total: number };
export type ProgressReporter = (progress: MirrorProgress) => void;

export const NO_PROGRESS: ProgressReporter = () => undefined;

const INCREMENT = 1;

const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    await CapacitorCalendar.deleteEvent({ id: eventId, span: EventSpan.THIS_AND_FUTURE_EVENTS });
  } catch (cause) {
    console.warn("Skipping calendar event that could not be deleted", eventId, cause);
  }
};

export const deleteEvents = async (ids: Iterable<string>): Promise<void> => {
  await Promise.all([...ids].map((id) => deleteEvent(id)));
};

export const createEvent = async (entry: DesiredEntry): Promise<CalendarEventMap[string]> => {
  const { id } = await CapacitorCalendar.createEvent(entry.event);
  return { eventId: id, fingerprint: fingerprintOf(entry.event) };
};

export const deleteEventsTracked = async (
  ids: string[],
  report: ProgressReporter,
): Promise<void> => {
  if (!ids.length) {
    return;
  }
  let done = 0;
  report({ done, phase: "removing", total: ids.length });
  await Promise.all(
    ids.map(async (id) => {
      await deleteEvent(id);
      done += INCREMENT;
      report({ done, phase: "removing", total: ids.length });
    }),
  );
};

export const createEventsTracked = async (
  entries: DesiredEntry[],
  report: ProgressReporter,
): Promise<CalendarEventMap> => {
  let done = 0;
  report({ done, phase: "adding", total: entries.length });
  const created = await Promise.all(
    entries.map(async (entry) => {
      const mirrored = await createEvent(entry);
      done += INCREMENT;
      report({ done, phase: "adding", total: entries.length });
      return [entry.key, mirrored] as const;
    }),
  );
  return Object.fromEntries(created);
};

export const summaryFor = (
  calendar: Calendar,
  createdCount: number,
  itemCount: number,
): MirrorSummary => ({
  calendarId: calendar.id,
  calendarSource: calendar.source?.title ?? null,
  calendarTitle: calendar.title,
  createdCount,
  itemCount,
});

export const requireCalendar = async (): Promise<Calendar> => {
  const calendar = await resolveCalendar();
  if (!calendar) {
    throw new Error("No writable calendar is available to sync into.");
  }
  return calendar;
};
