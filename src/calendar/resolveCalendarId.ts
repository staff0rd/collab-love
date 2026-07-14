import { CapacitorCalendar } from "@ebarooni/capacitor-calendar";

export const resolveCalendarId = async (): Promise<string | undefined> => {
  const { result: defaultCalendar } = await CapacitorCalendar.getDefaultCalendar();
  if (defaultCalendar) {
    return defaultCalendar.id;
  }
  const { result: calendars } = await CapacitorCalendar.listCalendars();
  return calendars.find((calendar) => calendar.allowsContentModifications === true)?.id;
};
