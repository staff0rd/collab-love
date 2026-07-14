import { type Calendar, CapacitorCalendar } from "@ebarooni/capacitor-calendar";

import { listWritableCalendars } from "./listWritableCalendars.ts";
import { getSelectedCalendarId, setSelectedCalendarId } from "./selectedCalendar.ts";

const pickDefault = async (writable: Calendar[]): Promise<Calendar | undefined> => {
  const { result: defaultCalendar } = await CapacitorCalendar.getDefaultCalendar();
  if (defaultCalendar && writable.some((calendar) => calendar.id === defaultCalendar.id)) {
    return defaultCalendar;
  }
  const [first] = writable;
  return first;
};

export const resolveCalendar = async (): Promise<Calendar | undefined> => {
  const writable = await listWritableCalendars();
  const selectedId = await getSelectedCalendarId();
  const selected = writable.find((calendar) => calendar.id === selectedId);
  if (selected) {
    return selected;
  }
  const fallback = await pickDefault(writable);
  if (fallback) {
    await setSelectedCalendarId(fallback.id);
  }
  return fallback;
};
