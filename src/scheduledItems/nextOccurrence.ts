import type { ScheduledItem } from "./getScheduledItems.ts";

const MS_PER_DAY = 86_400_000;
const DAYS_PER_WEEK = 7;
const MONTHS_PER_YEAR = 12;
const MIN_INTERVAL = 1;
const FIRST_STEP = 0;
const NEXT_STEP = 1;
const DATE_PART_BASE = 10;
const DATE_PAD = 2;
const MONTH_OFFSET = 1;

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const startOfDayMs = (date: Date) => startOfDay(date).getTime();

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

type Recurrer = {
  occurrenceAt: (step: number) => Date;
  estimateStep: (boundary: Date) => number;
};

const weeklyRecurrer = (anchor: Date, interval: number): Recurrer => {
  const stepDays = Math.max(MIN_INTERVAL, interval) * DAYS_PER_WEEK;
  return {
    estimateStep: (boundary) =>
      Math.floor((startOfDayMs(boundary) - startOfDayMs(anchor)) / MS_PER_DAY / stepDays),
    occurrenceAt: (step) => addDays(anchor, step * stepDays),
  };
};

const monthlyRecurrer = (anchor: Date, interval: number): Recurrer => {
  const stepMonths = Math.max(MIN_INTERVAL, interval);
  return {
    estimateStep: (boundary) =>
      Math.floor(
        ((boundary.getFullYear() - anchor.getFullYear()) * MONTHS_PER_YEAR +
          (boundary.getMonth() - anchor.getMonth())) /
          stepMonths,
      ),
    occurrenceAt: (step) => shiftMonths(anchor, step * stepMonths),
  };
};

const yearlyRecurrer = (anchor: Date): Recurrer => ({
  estimateStep: (boundary) => boundary.getFullYear() - anchor.getFullYear(),
  occurrenceAt: (step) => shiftMonths(anchor, step * MONTHS_PER_YEAR),
});

const recurrerFor = (item: ScheduledItem, anchor: Date): Recurrer | null => {
  const interval = item.recurrenceInterval ?? MIN_INTERVAL;
  if (item.recurrence === "weekly") {
    return weeklyRecurrer(anchor, interval);
  }
  if (item.recurrence === "monthly") {
    return monthlyRecurrer(anchor, interval);
  }
  if (item.recurrence === "yearly") {
    return yearlyRecurrer(anchor);
  }
  return null;
};

const latestStepOnOrBefore = (recurrer: Recurrer, boundary: Date): number => {
  const boundaryDay = startOfDayMs(boundary);
  let step = Math.max(FIRST_STEP, recurrer.estimateStep(boundary));
  while (startOfDayMs(recurrer.occurrenceAt(step + NEXT_STEP)) <= boundaryDay) {
    step += NEXT_STEP;
  }
  while (step > FIRST_STEP && startOfDayMs(recurrer.occurrenceAt(step)) > boundaryDay) {
    step -= NEXT_STEP;
  }
  return step;
};

const parseCompletedDay = (value: string): Date => {
  const [year, month, day] = value.split("-").map((part) => Number.parseInt(part, DATE_PART_BASE));
  return new Date(year, month - MONTH_OFFSET, day);
};

export const nextOccurrence = (item: ScheduledItem, now: Date): Date => {
  const anchor = new Date(item.scheduledAt);
  const recurrer = recurrerFor(item, anchor);
  if (!recurrer) {
    return anchor;
  }
  const currentCycleStep = latestStepOnOrBefore(recurrer, now);
  if (item.lastCompletedOccurrence === null) {
    return recurrer.occurrenceAt(currentCycleStep);
  }
  const stepAfterCompleted =
    latestStepOnOrBefore(recurrer, parseCompletedDay(item.lastCompletedOccurrence)) + NEXT_STEP;
  return recurrer.occurrenceAt(Math.max(currentCycleStep, stepAfterCompleted));
};

export const occurrenceDayValue = (occurrence: Date): string => {
  const month = String(occurrence.getMonth() + MONTH_OFFSET).padStart(DATE_PAD, "0");
  const day = String(occurrence.getDate()).padStart(DATE_PAD, "0");
  return `${occurrence.getFullYear()}-${month}-${day}`;
};
