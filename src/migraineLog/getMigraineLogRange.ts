import { supabase } from "../lib/supabaseClient.ts";

import {
  mapMigraineLogRow,
  MIGRAINE_LOG_COLUMNS,
  MIGRAINE_LOG_QUERY_PREFIX,
  type MigraineEntry,
  type MigraineLogRow,
} from "./getMigraineLog.ts";

export type MigraineLogDay = {
  logDate: string;
  entry: MigraineEntry;
};

export const migraineLogRangeQueryKey = (from: string, to: string) =>
  [...MIGRAINE_LOG_QUERY_PREFIX, "range", from, to] as const;

export const getMigraineLogRange = async (from: string, to: string): Promise<MigraineLogDay[]> => {
  const { data, error } = await supabase
    .from("migraine_logs")
    .select(MIGRAINE_LOG_COLUMNS)
    .gte("log_date", from)
    .lte("log_date", to)
    .order("log_date");
  if (error) {
    throw error;
  }

  return (data as MigraineLogRow[]).map((row) => ({
    entry: mapMigraineLogRow(row),
    logDate: row.log_date,
  }));
};
