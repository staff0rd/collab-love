import { addDays, atTimeOf, shiftMonths } from "../lib/dateMath";

export type SnoozeTarget = "tomorrow" | "nextWeek" | "nextMonth";

export const snoozeOptions: { label: string; target: SnoozeTarget }[] = [
  { label: "Tomorrow", target: "tomorrow" },
  { label: "Next week", target: "nextWeek" },
  { label: "Next month", target: "nextMonth" },
];

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
