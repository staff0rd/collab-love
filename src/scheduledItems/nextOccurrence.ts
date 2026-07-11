import type { ScheduledItem } from "./getScheduledItems.ts";

const MS_PER_DAY = 86_400_000;
const DAYS_PER_WEEK = 7;
const MONTHS_PER_YEAR = 12;
const MIN_INTERVAL = 1;
const NEXT_YEAR = 1;
const NEXT_STEP = 1;
const NO_STEPS = 0;

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const atTimeOf = (base: Date, source: Date) =>
  new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate(),
    source.getHours(),
    source.getMinutes(),
    source.getSeconds(),
  );

const addDays = (date: Date, days: number) =>
  atTimeOf(new Date(date.getFullYear(), date.getMonth(), date.getDate() + days), date);

const shiftMonths = (date: Date, months: number) =>
  atTimeOf(new Date(date.getFullYear(), date.getMonth() + months, date.getDate()), date);

const weeklyOccurrence = (anchor: Date, now: Date, interval: number): Date => {
  const stepDays = Math.max(MIN_INTERVAL, interval) * DAYS_PER_WEEK;
  const anchorStart = startOfDay(anchor).getTime();
  const todayStart = startOfDay(now).getTime();
  if (anchorStart >= todayStart) {
    return anchor;
  }
  const daysElapsed = Math.round((todayStart - anchorStart) / MS_PER_DAY);
  const steps = Math.ceil(daysElapsed / stepDays);
  return addDays(anchor, steps * stepDays);
};

const yearlyOccurrence = (anchor: Date, now: Date): Date => {
  const anchorStart = startOfDay(anchor).getTime();
  const todayStart = startOfDay(now).getTime();
  if (anchorStart >= todayStart) {
    return anchor;
  }
  const thisYear = atTimeOf(
    new Date(now.getFullYear(), anchor.getMonth(), anchor.getDate()),
    anchor,
  );
  if (startOfDay(thisYear).getTime() >= todayStart) {
    return thisYear;
  }
  return atTimeOf(
    new Date(now.getFullYear() + NEXT_YEAR, anchor.getMonth(), anchor.getDate()),
    anchor,
  );
};

const monthlyOccurrence = (anchor: Date, now: Date, stepMonths: number): Date => {
  const todayStart = startOfDay(now).getTime();
  const monthsApart =
    (now.getFullYear() - anchor.getFullYear()) * MONTHS_PER_YEAR +
    (now.getMonth() - anchor.getMonth());
  let steps = Math.max(NO_STEPS, Math.floor(monthsApart / stepMonths));
  let candidate = shiftMonths(anchor, steps * stepMonths);
  while (startOfDay(candidate).getTime() < todayStart) {
    steps += NEXT_STEP;
    candidate = shiftMonths(anchor, steps * stepMonths);
  }
  return candidate;
};

export const nextOccurrence = (item: ScheduledItem, now: Date): Date => {
  const anchor = new Date(item.scheduledAt);
  if (item.recurrence === "weekly") {
    return weeklyOccurrence(anchor, now, item.recurrenceInterval ?? MIN_INTERVAL);
  }
  if (item.recurrence === "monthly") {
    return monthlyOccurrence(anchor, now, item.recurrenceInterval ?? MIN_INTERVAL);
  }
  if (item.recurrence === "yearly") {
    return yearlyOccurrence(anchor, now);
  }
  return anchor;
};
