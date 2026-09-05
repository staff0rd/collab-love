import { useEffect, useState } from "react";

import { Capacitor } from "@capacitor/core";

import { NO_FEEDBACK, useGuardedAction } from "../lib/useGuardedAction.ts";

import { getPainRemindersEnabled, setPainRemindersEnabled } from "./painReminderPreference.ts";
import { requestNotificationAccess } from "./requestNotificationAccess.ts";

export const usePainReminderSetting = () => {
  const supported = Capacitor.isNativePlatform();
  const [enabled, setEnabled] = useState(false);
  const { busy, feedback, run, setFeedback } = useGuardedAction();

  useEffect(() => {
    if (!supported) {
      return;
    }
    void getPainRemindersEnabled().then(setEnabled);
  }, [supported]);

  const toggle = (next: boolean) =>
    run(async () => {
      if (!next) {
        await setPainRemindersEnabled(false);
        setEnabled(false);
        return;
      }
      if (!(await requestNotificationAccess())) {
        setFeedback({ ...NO_FEEDBACK, permissionDenied: true });
        return;
      }
      await setPainRemindersEnabled(true);
      setEnabled(true);
    });

  return {
    busy,
    enabled,
    error: feedback.error,
    permissionDenied: feedback.permissionDenied,
    supported,
    toggle,
  };
};
