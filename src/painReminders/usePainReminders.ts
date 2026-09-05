import { useEffect, useState } from "react";

import { Capacitor } from "@capacitor/core";

import { localDayValue } from "../lib/localDayValue.ts";
import type { PainReadings } from "../painLog/getPainLog.ts";
import { useCurrentMinute } from "../painLog/useCurrentMinute.ts";
import { usePainLog } from "../painLog/usePainLog.ts";

import {
  getPainRemindersEnabled,
  subscribeToPainReminderPreference,
} from "./painReminderPreference.ts";
import { painReminderSchedule, type PainReminder } from "./painReminderSchedule.ts";
import { reconcilePainReminders } from "./reconcilePainReminders.ts";

const FIRST_PASS = 0;
const NEXT_PASS = 1;
const NO_REMINDERS: PainReminder[] = [];

const desiredReminders = async (readings: PainReadings): Promise<PainReminder[]> => {
  if (await getPainRemindersEnabled()) {
    return painReminderSchedule(new Date(), readings);
  }
  return NO_REMINDERS;
};

export const usePainReminders = (): void => {
  const now = useCurrentMinute();
  const logDate = localDayValue(now);
  const { loading, readings } = usePainLog(logDate);
  const [preferencePass, setPreferencePass] = useState(FIRST_PASS);

  useEffect(
    () => subscribeToPainReminderPreference(() => setPreferencePass((pass) => pass + NEXT_PASS)),
    [],
  );

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || loading) {
      return;
    }
    void (async () => {
      await reconcilePainReminders(await desiredReminders(readings));
    })().catch((cause) => {
      console.error("Failed to reconcile pain log reminders", cause);
    });
  }, [loading, logDate, preferencePass, readings]);
};
