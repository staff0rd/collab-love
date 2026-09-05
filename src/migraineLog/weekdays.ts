import { addDays } from "../lib/dateMath.ts";

const SUNDAY = 0;
const MONDAY = 1;
const SATURDAY = 6;

const PREVIOUS_DAY = -1;
const MONDAY_BACK_TO_FRIDAY = -3;
const SUNDAY_BACK_TO_FRIDAY = -2;

export const isWeekday = (date: Date) => {
  const day = date.getDay();
  return day !== SUNDAY && day !== SATURDAY;
};

const previousWeekdayOffset = (day: number) => {
  if (day === MONDAY) {
    return MONDAY_BACK_TO_FRIDAY;
  }
  if (day === SUNDAY) {
    return SUNDAY_BACK_TO_FRIDAY;
  }
  return PREVIOUS_DAY;
};

export const previousWeekday = (date: Date) => addDays(date, previousWeekdayOffset(date.getDay()));

export const weekdayName = (date: Date) => date.toLocaleDateString(undefined, { weekday: "long" });
