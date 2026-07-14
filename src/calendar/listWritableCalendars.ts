import {
  type Calendar,
  CalendarSourceType,
  CalendarType,
  CapacitorCalendar,
} from "@ebarooni/capacitor-calendar";

const isWritable = (calendar: Calendar): boolean =>
  calendar.allowsContentModifications === true &&
  calendar.isSubscribed !== true &&
  calendar.type !== CalendarType.SUBSCRIPTION &&
  calendar.type !== CalendarType.BIRTHDAY;

const RANK_SYNCED = 0;
const RANK_OTHER = 1;
const RANK_DEVICE_LOCAL = 2;

const sourceRank = (calendar: Calendar): number => {
  switch (calendar.source?.type) {
    case CalendarSourceType.CAL_DAV:
    case CalendarSourceType.MOBILE_ME:
    case CalendarSourceType.EXCHANGE:
      return RANK_SYNCED;
    case CalendarSourceType.LOCAL:
      return RANK_DEVICE_LOCAL;
    default:
      return RANK_OTHER;
  }
};

export const listWritableCalendars = async (): Promise<Calendar[]> => {
  const { result } = await CapacitorCalendar.listCalendars();
  return result
    .filter(isWritable)
    .sort((calendarA, calendarB) => sourceRank(calendarA) - sourceRank(calendarB));
};
