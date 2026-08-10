import { addDays } from "../lib/dateMath.ts";
import { localDayValue } from "../lib/localDayValue.ts";

export type PainRangeKey = "week" | "month" | "quarter";

type PainGranularity = "reading" | "day";

export type PainRange = {
  key: PainRangeKey;
  label: string;
  days: number;
  granularity: PainGranularity;
  tickEveryDays: number;
};

const WEEK_DAYS = 7;
const MONTH_DAYS = 30;
const QUARTER_DAYS = 90;
const INCLUSIVE_END = 1;

export const PAIN_RANGES: PainRange[] = [
  { days: WEEK_DAYS, granularity: "reading", key: "week", label: "Week", tickEveryDays: 1 },
  { days: MONTH_DAYS, granularity: "day", key: "month", label: "Month", tickEveryDays: 7 },
  { days: QUARTER_DAYS, granularity: "day", key: "quarter", label: "Quarter", tickEveryDays: 21 },
];

export const painRangeDates = (range: PainRange, today: Date) => ({
  from: localDayValue(addDays(today, -(range.days - INCLUSIVE_END))),
  to: localDayValue(today),
});
