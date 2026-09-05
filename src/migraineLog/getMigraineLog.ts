import { supabase } from "../lib/supabaseClient.ts";

export const MIGRAINE_LOG_QUERY_PREFIX = ["migraineLog"] as const;

export const migraineLogQueryKey = (logDate: string) =>
  [...MIGRAINE_LOG_QUERY_PREFIX, logDate] as const;

export type MigraineAnswer = boolean | null;

export type MigraineEntry = {
  exercised: MigraineAnswer;
  migraine: MigraineAnswer;
  tookAspirin: boolean;
  tookCodeine: boolean;
};

export type MigraineLogRow = {
  log_date: string;
  exercised: boolean | null;
  migraine: boolean | null;
  took_aspirin: boolean | null;
  took_codeine: boolean | null;
};

export const MIGRAINE_LOG_COLUMNS = "log_date, exercised, migraine, took_aspirin, took_codeine";

export const NO_MIGRAINE_ENTRY: MigraineEntry = {
  exercised: null,
  migraine: null,
  tookAspirin: false,
  tookCodeine: false,
};

export const mapMigraineLogRow = (row: MigraineLogRow): MigraineEntry => ({
  exercised: row.exercised,
  migraine: row.migraine,
  tookAspirin: row.took_aspirin ?? false,
  tookCodeine: row.took_codeine ?? false,
});

export const getMigraineLog = async (logDate: string): Promise<MigraineEntry> => {
  const { data, error } = await supabase
    .from("migraine_logs")
    .select(MIGRAINE_LOG_COLUMNS)
    .eq("log_date", logDate)
    .maybeSingle();
  if (error) {
    throw error;
  }
  if (!data) {
    return NO_MIGRAINE_ENTRY;
  }

  return mapMigraineLogRow(data as MigraineLogRow);
};
