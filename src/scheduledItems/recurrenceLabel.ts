import type { ScheduledItem } from "./getScheduledItems.ts";

const SINGLE_WEEK = 1;
const HALF_YEAR_MONTHS = 6;

export type RecurrenceSummary = Pick<
  ScheduledItem,
  "scheduledAt" | "recurrence" | "recurrenceInterval"
>;

const anchorDate = (scheduledAt: string): Date | null => {
  const date = new Date(scheduledAt);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
};

const weekdayOf = (date: Date | null): string | null => {
  if (!date) {
    return null;
  }
  return date.toLocaleDateString(undefined, { weekday: "long" });
};

const monthDayOf = (date: Date | null): string | null => {
  if (!date) {
    return null;
  }
  return date.toLocaleDateString(undefined, { day: "numeric", month: "long" });
};

const cadenceLabel = (weeks: number): string => {
  if (weeks === SINGLE_WEEK) {
    return "Weekly";
  }
  return `Every ${weeks} weeks`;
};

const weeklyLabel = (date: Date | null, interval: number | null): string => {
  const cadence = cadenceLabel(interval ?? SINGLE_WEEK);
  const weekday = weekdayOf(date);
  if (weekday) {
    return `${cadence} on ${weekday}`;
  }
  return cadence;
};

const yearlyLabel = (date: Date | null): string => {
  const monthDay = monthDayOf(date);
  if (monthDay) {
    return `Yearly on ${monthDay}`;
  }
  return "Yearly";
};

const shiftMonths = (date: Date, months: number): Date =>
  new Date(date.getFullYear(), date.getMonth() + months, date.getDate());

const halfYearlyLabel = (date: Date | null): string => {
  const first = monthDayOf(date);
  if (!date || !first) {
    return "Twice a year";
  }
  const second = monthDayOf(shiftMonths(date, HALF_YEAR_MONTHS));
  return `Twice a year on ${first} and ${second}`;
};

const seasonalLabel = (recurrence: "before-winter" | "before-summer"): string => {
  if (recurrence === "before-winter") {
    return "Before winter";
  }
  return "Before summer";
};

export const recurrenceLabel = (item: RecurrenceSummary): string | null => {
  const date = anchorDate(item.scheduledAt);
  if (item.recurrence === "weekly") {
    return weeklyLabel(date, item.recurrenceInterval);
  }
  if (item.recurrence === "yearly") {
    return yearlyLabel(date);
  }
  if (item.recurrence === "half-yearly") {
    return halfYearlyLabel(date);
  }
  if (item.recurrence === "before-winter" || item.recurrence === "before-summer") {
    return seasonalLabel(item.recurrence);
  }
  return null;
};
