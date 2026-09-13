import { addDays, shiftMonths } from "../lib/dateMath";
import type { ScheduledItem } from "./getScheduledItems.ts";

const MS_PER_DAY = 86_400_000;
const DAYS_PER_WEEK = 7;
const MONTHS_PER_YEAR = 12;
const MIN_INTERVAL = 1;
const FIRST_STEP = 0;
const NEXT_STEP = 1;
const NO_COMPLETED_CYCLE = FIRST_STEP - NEXT_STEP;
const DATE_PART_BASE = 10;
const MONTH_OFFSET = 1;

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const startOfDayMs = (date: Date) => startOfDay(date).getTime();

type Recurrer = {
  occurrenceAt: (step: number) => Date;
  estimateStep: (boundary: Date) => number;
};

const dayStepRecurrer = (anchor: Date, stepDays: number): Recurrer => ({
  estimateStep: (boundary) =>
    Math.floor((startOfDayMs(boundary) - startOfDayMs(anchor)) / MS_PER_DAY / stepDays),
  occurrenceAt: (step) => addDays(anchor, step * stepDays),
});

const monthlyRecurrer = (anchor: Date, stepMonths: number): Recurrer => ({
  estimateStep: (boundary) =>
    Math.floor(
      ((boundary.getFullYear() - anchor.getFullYear()) * MONTHS_PER_YEAR +
        (boundary.getMonth() - anchor.getMonth())) /
        stepMonths,
    ),
  occurrenceAt: (step) => shiftMonths(anchor, step * stepMonths),
});

const yearlyRecurrer = (anchor: Date): Recurrer => ({
  estimateStep: (boundary) => boundary.getFullYear() - anchor.getFullYear(),
  occurrenceAt: (step) => shiftMonths(anchor, step * MONTHS_PER_YEAR),
});

const recurrerFor = (item: ScheduledItem, anchor: Date): Recurrer | null => {
  const interval = Math.max(MIN_INTERVAL, item.recurrenceInterval ?? MIN_INTERVAL);
  if (item.recurrence === "daily") {
    return dayStepRecurrer(anchor, interval);
  }
  if (item.recurrence === "weekly") {
    return dayStepRecurrer(anchor, interval * DAYS_PER_WEEK);
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

const completedCycleStep = (recurrer: Recurrer, completed: Date): number => {
  const anchorDay = startOfDayMs(recurrer.occurrenceAt(FIRST_STEP));
  if (startOfDayMs(completed) < anchorDay) {
    return NO_COMPLETED_CYCLE;
  }
  return latestStepOnOrBefore(recurrer, completed);
};

const recurringOccurrence = (item: ScheduledItem, recurrer: Recurrer, now: Date): Date => {
  const currentCycleStep = latestStepOnOrBefore(recurrer, now);
  if (item.lastCompletedOccurrence === null) {
    return recurrer.occurrenceAt(currentCycleStep);
  }
  const stepAfterCompleted =
    completedCycleStep(recurrer, parseCompletedDay(item.lastCompletedOccurrence)) + NEXT_STEP;
  return recurrer.occurrenceAt(Math.max(currentCycleStep, stepAfterCompleted));
};

export const nextOccurrence = (item: ScheduledItem, now: Date): Date => {
  if (item.bumpedTo !== null) {
    return new Date(item.bumpedTo);
  }
  const anchor = new Date(item.scheduledAt);
  const recurrer = recurrerFor(item, anchor);
  if (!recurrer) {
    return anchor;
  }
  return recurringOccurrence(item, recurrer, now);
};
