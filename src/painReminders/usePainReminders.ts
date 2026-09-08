import { useEffect, useState } from "react";

import { Capacitor } from "@capacitor/core";

import { useLocalDay } from "../lib/useLocalDay.ts";
import type { PainReadings } from "../painLog/getPainLog.ts";
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

const useReconcilePass = (): number => {
  const [pass, setPass] = useState(FIRST_PASS);

  useEffect(() => {
    const nextPass = () => setPass((current) => current + NEXT_PASS);
    const passOnResume = () => {
      if (document.visibilityState === "visible") {
        nextPass();
      }
    };
    document.addEventListener("visibilitychange", passOnResume);
    const unsubscribe = subscribeToPainReminderPreference(nextPass);
    return () => {
      document.removeEventListener("visibilitychange", passOnResume);
      unsubscribe();
    };
  }, []);

  return pass;
};

export const usePainReminders = (): void => {
  const logDate = useLocalDay();
  const { error, loading, readings } = usePainLog(logDate);
  const pass = useReconcilePass();

  useEffect(() => {
    const unreadableReadings = loading || error !== null;
    if (!Capacitor.isNativePlatform() || unreadableReadings) {
      return;
    }
    void (async () => {
      await reconcilePainReminders(await desiredReminders(readings));
    })().catch((cause) => {
      console.error("Failed to reconcile pain log reminders", cause);
    });
  }, [error, loading, logDate, pass, readings]);
};
