import { addDays } from "../lib/dateMath.ts";
import { localDayValue } from "../lib/localDayValue.ts";

import { NO_PAIN_READINGS, type PainReading, type PainReadings } from "./getPainLog.ts";
import type { PainLogDay } from "./getPainLogRange.ts";
import type { PainRange } from "./painRanges.ts";
import { painSlots, type PainSlotKey } from "./painSlots.ts";

const NONE = 0;
const FIRST_DAY_OFFSET = 1;
const ONE_DECIMAL = 10;
const TICK_SLOT: PainSlotKey = "midday";
const NO_TICK = "";

export type PainPoint = {
  key: string;
  tick: string;
  label: string;
  level: number | null;
  extraMedication: boolean;
};

export type PainSeries = {
  points: PainPoint[];
  readingCount: number;
  averageLevel: number | null;
  extraMedicationDays: number;
};

type DaySlice = {
  day: Date;
  readings: PainReadings;
  tick: string;
};

const dayLabel = (day: Date) =>
  day.toLocaleDateString(undefined, { day: "numeric", month: "short", weekday: "short" });

const tickLabel = (range: PainRange, day: Date) => {
  if (range.granularity === "reading") {
    return day.toLocaleDateString(undefined, { weekday: "short" });
  }
  return day.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

const recordedReadings = (readings: PainReadings): PainReading[] =>
  Object.values(readings).filter((reading): reading is PainReading => reading !== null);

const averageLevel = (readings: PainReading[]): number | null => {
  if (readings.length === NONE) {
    return null;
  }
  const total = readings.reduce((sum, reading) => sum + reading.level, NONE);
  return Math.round((total / readings.length) * ONE_DECIMAL) / ONE_DECIMAL;
};

const rangeDays = (range: PainRange, today: Date): Date[] =>
  [...Array(range.days).keys()].map((index) =>
    addDays(today, index - (range.days - FIRST_DAY_OFFSET)),
  );

const isTickDay = (range: PainRange, index: number, dayCount: number) =>
  (dayCount - FIRST_DAY_OFFSET - index) % range.tickEveryDays === NONE;

const dayTicks = (range: PainRange, calendar: Date[]): string[] =>
  calendar.map((day, index) => {
    if (isTickDay(range, index, calendar.length)) {
      return tickLabel(range, day);
    }
    return NO_TICK;
  });

const daySlices = (
  range: PainRange,
  calendar: Date[],
  readingsByDate: Map<string, PainReadings>,
): DaySlice[] => {
  const ticks = dayTicks(range, calendar);
  return calendar.map((day, index) => ({
    day,
    readings: readingsByDate.get(localDayValue(day)) ?? NO_PAIN_READINGS,
    tick: ticks[index],
  }));
};

const dailyPoint = ({ day, readings, tick }: DaySlice): PainPoint => {
  const recorded = recordedReadings(readings);
  return {
    extraMedication: recorded.some((reading) => reading.extraMedication),
    key: localDayValue(day),
    label: dayLabel(day),
    level: averageLevel(recorded),
    tick,
  };
};

const slotTick = (slotKey: PainSlotKey, tick: string) => {
  if (slotKey === TICK_SLOT) {
    return tick;
  }
  return NO_TICK;
};

const readingPoints = ({ day, readings, tick }: DaySlice): PainPoint[] =>
  painSlots(day).map((slot) => {
    const reading = readings[slot.key];
    return {
      extraMedication: reading?.extraMedication ?? false,
      key: `${localDayValue(day)}-${slot.key}`,
      label: `${dayLabel(day)}, ${slot.label}`,
      level: reading?.level ?? null,
      tick: slotTick(slot.key, tick),
    };
  });

const dayPoints = (range: PainRange, slice: DaySlice) => {
  if (range.granularity === "reading") {
    return readingPoints(slice);
  }
  return [dailyPoint(slice)];
};

const summarise = (slices: DaySlice[]) => {
  const perDay = slices.map((slice) => recordedReadings(slice.readings));
  const recorded = perDay.flat();

  return {
    averageLevel: averageLevel(recorded),
    extraMedicationDays: perDay.filter((readings) =>
      readings.some((reading) => reading.extraMedication),
    ).length,
    readingCount: recorded.length,
  };
};

export const painSeries = (days: PainLogDay[], range: PainRange, today: Date): PainSeries => {
  const readingsByDate = new Map(days.map((day) => [day.logDate, day.readings]));
  const slices = daySlices(range, rangeDays(range, today), readingsByDate);

  return {
    ...summarise(slices),
    points: slices.flatMap((slice) => dayPoints(range, slice)),
  };
};
