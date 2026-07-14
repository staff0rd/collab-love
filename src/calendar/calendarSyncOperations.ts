import type { Calendar } from "@ebarooni/capacitor-calendar";

import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

import { getCalendarSyncEnabled, setCalendarSyncEnabled } from "./calendarSyncPreference.ts";
import { listWritableCalendars } from "./listWritableCalendars.ts";
import {
  clearMirroredEvents,
  type MirrorSummary,
  mirrorScheduledItems,
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

export const disableCalendarSync = async (): Promise<void> => {
  await setCalendarSyncEnabled(false);
  await clearMirroredEvents();
};

export const selectCalendarTarget = (id: string): Promise<void> => setSelectedCalendarId(id);

export const mirrorInto = (items: ScheduledItem[]): Promise<MirrorSummary> =>
  mirrorScheduledItems(items);

export const describeMirror = (summary: MirrorSummary): string => {
  let target = summary.calendarTitle;
  if (summary.calendarSource) {
    target = `${summary.calendarTitle} (${summary.calendarSource})`;
  }
  return `Synced ${summary.createdCount} new of ${summary.itemCount} into ${target}`;
};

export const errorMessage = (caught: unknown): string => {
  if (caught instanceof Error) {
    return caught.message;
  }
  return String(caught);
};
