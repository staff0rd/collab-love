import { CapacitorCalendar } from "@ebarooni/capacitor-calendar";

const GRANTED = "granted";

export const requestCalendarAccess = async (): Promise<boolean> => {
  const { result } = await CapacitorCalendar.requestFullCalendarAccess();
  return result === GRANTED;
};
