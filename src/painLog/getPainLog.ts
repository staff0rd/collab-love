import { supabase } from "../lib/supabaseClient.ts";

import type { PainSlotKey } from "./painSlots.ts";

export const PAIN_LOG_QUERY_PREFIX = ["painLog"] as const;

export const painLogQueryKey = (logDate: string) => [...PAIN_LOG_QUERY_PREFIX, logDate] as const;

export type PainReading = {
  level: number;
  extraMedication: boolean;
};

export type PainReadings = Record<PainSlotKey, PainReading | null>;

type PainLogRow = {
  log_date: string;
  morning_level: number | null;
  morning_extra_med: boolean | null;
  midday_level: number | null;
  midday_extra_med: boolean | null;
  evening_level: number | null;
  evening_extra_med: boolean | null;
};

const PAIN_LOG_COLUMNS =
  "log_date, morning_level, morning_extra_med, midday_level, midday_extra_med, evening_level, evening_extra_med";

export const NO_PAIN_READINGS: PainReadings = { evening: null, midday: null, morning: null };

const readingWithoutLevelIsUnrecorded = (
  level: number | null,
  extraMedication: boolean | null,
): PainReading | null => {
  if (level === null) {
    return null;
  }
  return { extraMedication: extraMedication ?? false, level };
};

const mapPainLogRow = (row: PainLogRow): PainReadings => ({
  evening: readingWithoutLevelIsUnrecorded(row.evening_level, row.evening_extra_med),
  midday: readingWithoutLevelIsUnrecorded(row.midday_level, row.midday_extra_med),
  morning: readingWithoutLevelIsUnrecorded(row.morning_level, row.morning_extra_med),
});

export const getPainLog = async (logDate: string): Promise<PainReadings> => {
  const { data, error } = await supabase
    .from("pain_logs")
    .select(PAIN_LOG_COLUMNS)
    .eq("log_date", logDate)
    .maybeSingle();
  if (error) {
    throw error;
  }
  if (!data) {
    return NO_PAIN_READINGS;
  }

  return mapPainLogRow(data as PainLogRow);
};
