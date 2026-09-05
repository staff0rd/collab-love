import { supabase } from "../lib/supabaseClient.ts";

import type { MigraineEntry } from "./getMigraineLog.ts";

const MIGRAINE_LOG_CONFLICT_TARGET = "household_id,log_date";

export const saveMigraineEntry = async (logDate: string, entry: MigraineEntry): Promise<void> => {
  const { error } = await supabase.from("migraine_logs").upsert(
    {
      exercised: entry.exercised,
      log_date: logDate,
      migraine: entry.migraine,
      took_aspirin: entry.tookAspirin,
      took_codeine: entry.tookCodeine,
    },
    { onConflict: MIGRAINE_LOG_CONFLICT_TARGET },
  );
  if (error) {
    throw error;
  }
};
