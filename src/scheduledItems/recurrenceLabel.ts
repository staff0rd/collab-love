import type { ScheduledItem } from "./getScheduledItems.ts";

const SINGLE_WEEK = 1;
const SINGLE_MONTH = 1;

const ORDINAL_RULES = new Intl.PluralRules("en", { type: "ordinal" });
const ORDINAL_SUFFIX: Record<Intl.LDMLPluralRule, string> = {
  few: "rd",
  many: "th",
  one: "st",
  other: "th",
  two: "nd",
  zero: "th",
};

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

const ordinal = (day: number): string => `${day}${ORDINAL_SUFFIX[ORDINAL_RULES.select(day)]}`;

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

const monthlyCadence = (months: number): string => {
  if (months === SINGLE_MONTH) {
    return "Monthly";
  }
  return `Every ${months} months`;
};

const monthlyLabel = (date: Date | null, interval: number | null): string => {
  const cadence = monthlyCadence(interval ?? SINGLE_MONTH);
  if (!date) {
    return cadence;
  }
  return `${cadence} on the ${ordinal(date.getDate())}`;
};

const yearlyLabel = (date: Date | null): string => {
  const monthDay = monthDayOf(date);
  if (monthDay) {
    return `Yearly on ${monthDay}`;
  }
  return "Yearly";
};

export const recurrenceLabel = (item: RecurrenceSummary): string | null => {
  const date = anchorDate(item.scheduledAt);
  if (item.recurrence === "weekly") {
    return weeklyLabel(date, item.recurrenceInterval);
  }
  if (item.recurrence === "monthly") {
    return monthlyLabel(date, item.recurrenceInterval);
  }
  if (item.recurrence === "yearly") {
    return yearlyLabel(date);
  }
  return null;
};
