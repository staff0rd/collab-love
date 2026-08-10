import { supabase } from "../lib/supabaseClient.ts";

import {
  mapPainLogRow,
  PAIN_LOG_COLUMNS,
  PAIN_LOG_QUERY_PREFIX,
  type PainLogRow,
  type PainReadings,
} from "./getPainLog.ts";

export type PainLogDay = {
  logDate: string;
  readings: PainReadings;
};

export const painLogRangeQueryKey = (from: string, to: string) =>
  [...PAIN_LOG_QUERY_PREFIX, "range", from, to] as const;

export const getPainLogRange = async (from: string, to: string): Promise<PainLogDay[]> => {
  const { data, error } = await supabase
    .from("pain_logs")
    .select(PAIN_LOG_COLUMNS)
    .gte("log_date", from)
    .lte("log_date", to)
    .order("log_date");
  if (error) {
    throw error;
  }

  return (data as PainLogRow[]).map((row) => ({
    logDate: row.log_date,
    readings: mapPainLogRow(row),
  }));
};
