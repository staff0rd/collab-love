import { addDays, addWeeks } from "../lib/dateMath.ts";
import { localDayValue } from "../lib/localDayValue.ts";

import { NO_MIGRAINE_ENTRY, type MigraineEntry } from "./getMigraineLog.ts";
import type { MigraineLogDay } from "./getMigraineLogRange.ts";
import { migraineRangeStart, type MigraineRange } from "./migraineRanges.ts";

const WEEKDAYS = 5;

type MigraineWeekday = {
  key: string;
  label: string;
  entry: MigraineEntry;
  future: boolean;
};

export type MigraineWeek = {
  key: string;
  label: string;
  days: MigraineWeekday[];
};

const weekLabel = (start: Date) =>
  start.toLocaleDateString(undefined, { day: "numeric", month: "short" });

const dayLabel = (date: Date) =>
  date.toLocaleDateString(undefined, { day: "numeric", month: "short", weekday: "short" });

const weekStarts = (range: MigraineRange, today: Date): Date[] => {
  const first = migraineRangeStart(range, today);
  return [...Array(range.weeks).keys()].map((index) => addWeeks(first, index));
};

const weekdayDates = (start: Date): Date[] =>
  [...Array(WEEKDAYS).keys()].map((index) => addDays(start, index));

export const migraineWeeks = (
  days: MigraineLogDay[],
  range: MigraineRange,
  today: Date,
): MigraineWeek[] => {
  const entriesByDate = new Map(days.map((day) => [day.logDate, day.entry]));
  const todayValue = localDayValue(today);

  return weekStarts(range, today).map((start) => ({
    days: weekdayDates(start).map((date) => {
      const value = localDayValue(date);
      return {
        entry: entriesByDate.get(value) ?? NO_MIGRAINE_ENTRY,
        future: value > todayValue,
        key: value,
        label: dayLabel(date),
      };
    }),
    key: localDayValue(start),
    label: weekLabel(start),
  }));
};
