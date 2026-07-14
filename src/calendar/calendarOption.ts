import type { Calendar } from "@ebarooni/capacitor-calendar";

export const calendarOptionLabel = (calendar: Calendar): string => {
  if (calendar.source?.title) {
    return `${calendar.title} (${calendar.source.title})`;
  }
  return calendar.title;
};

export const selectedOptionValue = (calendars: Calendar[], selectedId: string | null): string => {
  if (selectedId && calendars.some((calendar) => calendar.id === selectedId)) {
    return selectedId;
  }
  return "";
};
