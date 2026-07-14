import { type Calendar, CapacitorCalendar } from "@ebarooni/capacitor-calendar";

export const resolveCalendar = async (): Promise<Calendar | undefined> => {
  const { result: defaultCalendar } = await CapacitorCalendar.getDefaultCalendar();
  if (defaultCalendar) {
    return defaultCalendar;
  }
  const { result: calendars } = await CapacitorCalendar.listCalendars();
  return calendars.find((calendar) => calendar.allowsContentModifications === true);
};
