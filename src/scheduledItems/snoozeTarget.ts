import { addDays, atTimeOf, shiftMonths } from "../lib/dateMath";

export type SnoozeTarget = "tomorrow" | "nextWeek" | "nextMonth";

const snoozeLabels: Record<SnoozeTarget, string> = {
  nextMonth: "Next month",
  nextWeek: "Next week",
  tomorrow: "Tomorrow",
};

const snoozeOrder: SnoozeTarget[] = ["tomorrow", "nextWeek", "nextMonth"];

export const snoozeLabel = (target: SnoozeTarget): string => snoozeLabels[target];

export const snoozeOptions = snoozeOrder.map((target) => ({
  label: snoozeLabels[target],
  target,
}));

const ONE_DAY = 1;
const ONE_WEEK = 7;
const ONE_MONTH = 1;

const snoozeDay = (target: SnoozeTarget, now: Date): Date => {
  if (target === "tomorrow") {
    return addDays(now, ONE_DAY);
  }
  if (target === "nextWeek") {
    return addDays(now, ONE_WEEK);
  }
  return shiftMonths(now, ONE_MONTH);
};

export const snoozeTargetDate = (target: SnoozeTarget, originalTime: Date, now: Date): Date =>
  atTimeOf(snoozeDay(target, now), originalTime);
