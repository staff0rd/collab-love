import { addWeeks, startOfWeek } from "../lib/dateMath.ts";
import { localDayValue } from "../lib/localDayValue.ts";

type MigraineRangeKey = "month" | "quarter" | "half";

export type MigraineRange = {
  key: MigraineRangeKey;
  label: string;
  weeks: number;
};

const MONTH_WEEKS = 4;
const QUARTER_WEEKS = 12;
const HALF_YEAR_WEEKS = 26;
const CURRENT_WEEK = 1;

export const MIGRAINE_RANGES: MigraineRange[] = [
  { key: "month", label: "4 weeks", weeks: MONTH_WEEKS },
  { key: "quarter", label: "12 weeks", weeks: QUARTER_WEEKS },
  { key: "half", label: "26 weeks", weeks: HALF_YEAR_WEEKS },
];

export const migraineRangeStart = (range: MigraineRange, today: Date) =>
  addWeeks(startOfWeek(today), -(range.weeks - CURRENT_WEEK));

export const migraineRangeDates = (range: MigraineRange, today: Date) => ({
  from: localDayValue(migraineRangeStart(range, today)),
  to: localDayValue(today),
});
