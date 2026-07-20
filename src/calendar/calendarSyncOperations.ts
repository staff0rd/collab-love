import type { Calendar } from "@ebarooni/capacitor-calendar";

import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

import type { MirrorProgress, MirrorSummary, ProgressReporter } from "./calendarEventOps.ts";
import { getCalendarSyncEnabled, setCalendarSyncEnabled } from "./calendarSyncPreference.ts";
import { listWritableCalendars } from "./listWritableCalendars.ts";
import {
  clearMirroredEvents,
  mirrorScheduledItems,
  resyncMirroredEvents,
} from "./mirrorScheduledItems.ts";
import { requestCalendarAccess } from "./requestCalendarAccess.ts";
import { getSelectedCalendarId, setSelectedCalendarId } from "./selectedCalendar.ts";

export type CalendarSelection = {
  calendars: Calendar[];
  selectedId: string | null;
};

const currentSelection = async (): Promise<CalendarSelection> => ({
  calendars: await listWritableCalendars(),
  selectedId: await getSelectedCalendarId(),
});

export const loadEnabledSelection = async (): Promise<CalendarSelection | null> => {
  if (!(await getCalendarSyncEnabled())) {
    return null;
  }
  return currentSelection();
};

export const enableCalendarSync = async (): Promise<CalendarSelection | null> => {
  if (!(await requestCalendarAccess())) {
    return null;
  }
  await setCalendarSyncEnabled(true);
  return currentSelection();
};

export const disableCalendarSync = async (
  items: ScheduledItem[],
  report: ProgressReporter,
): Promise<void> => {
  await setCalendarSyncEnabled(false);
  await clearMirroredEvents(items, report);
};

export const selectCalendarTarget = (id: string): Promise<void> => setSelectedCalendarId(id);

export const mirrorInto = (items: ScheduledItem[]): Promise<MirrorSummary> =>
  mirrorScheduledItems(items);

export const resyncInto = (
  items: ScheduledItem[],
  report: ProgressReporter,
): Promise<MirrorSummary> => resyncMirroredEvents(items, report);

const mirrorTarget = (summary: MirrorSummary): string => {
  if (summary.calendarSource) {
    return `${summary.calendarTitle} (${summary.calendarSource})`;
  }
  return summary.calendarTitle;
};

export const describeMirror = (summary: MirrorSummary): string =>
  `Synced ${summary.createdCount} new of ${summary.itemCount} into ${mirrorTarget(summary)}`;

export const describeResync = (summary: MirrorSummary): string =>
  `Cleared duplicates and synced ${summary.createdCount} events into ${mirrorTarget(summary)}`;

export const describeProgress = (progress: MirrorProgress): string => {
  if (progress.phase === "scanning") {
    return "Scanning calendar…";
  }
  if (progress.phase === "removing") {
    return `Removing events… ${progress.done} / ${progress.total}`;
  }
  return `Adding events… ${progress.done} / ${progress.total}`;
};

export const errorMessage = (caught: unknown): string => {
  if (caught instanceof Error) {
    return caught.message;
  }
  return String(caught);
};
