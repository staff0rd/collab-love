import { supabase } from "../lib/supabaseClient.ts";

import type { PainReading } from "./getPainLog.ts";
import type { PainSlotKey } from "./painSlots.ts";

const PAIN_LOG_CONFLICT_TARGET = "household_id,log_date";

export type PainReadingWrite = {
  slot: PainSlotKey;
  reading: PainReading | null;
};

export const savePainReading = async (
  logDate: string,
  { slot, reading }: PainReadingWrite,
): Promise<void> => {
  const { error } = await supabase.from("pain_logs").upsert(
    {
      [`${slot}_extra_med`]: reading?.extraMedication ?? null,
      [`${slot}_level`]: reading?.level ?? null,
      log_date: logDate,
    },
    { onConflict: PAIN_LOG_CONFLICT_TARGET },
  );
  if (error) {
    throw error;
  }
};
