import { useEffect, useState } from "react";

import { Capacitor } from "@capacitor/core";

import { useGuardedAction } from "../lib/useGuardedAction.ts";

import { disablePainReminders } from "./disablePainReminders.ts";
import { notificationAccessDenied } from "./notificationAccessDenied.ts";
import { getPainRemindersEnabled, setPainRemindersEnabled } from "./painReminderPreference.ts";
import { requestNotificationAccess } from "./requestNotificationAccess.ts";

type PainReminderAccess = {
  denied: boolean;
  enabled: boolean;
};

const DEFAULT_ACCESS: PainReminderAccess = { denied: false, enabled: false };

const currentAccess = async (): Promise<PainReminderAccess> => {
  const denied = await notificationAccessDenied();
  if (!denied) {
    return { denied, enabled: await getPainRemindersEnabled() };
  }
  if (await getPainRemindersEnabled()) {
    await disablePainReminders();
  }
  return { denied, enabled: false };
};

export const usePainReminderSetting = () => {
  const supported = Capacitor.isNativePlatform();
  const [access, setAccess] = useState<PainReminderAccess>(DEFAULT_ACCESS);
  const { busy, feedback, run } = useGuardedAction();

  useEffect(() => {
    if (!supported) {
      return;
    }
    const refresh = () => {
      void currentAccess().then(setAccess);
    };
    const refreshOnResume = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };
    refresh();
    document.addEventListener("visibilitychange", refreshOnResume);
    return () => {
      document.removeEventListener("visibilitychange", refreshOnResume);
    };
  }, [supported]);

  const toggle = (next: boolean) =>
    run(async () => {
      if (!next) {
        await disablePainReminders();
        setAccess(DEFAULT_ACCESS);
        return;
      }
      if (!(await requestNotificationAccess())) {
        setAccess({ denied: true, enabled: false });
        return;
      }
      await setPainRemindersEnabled(true);
      setAccess({ denied: false, enabled: true });
    });

  return {
    busy,
    enabled: access.enabled,
    error: feedback.error,
    permissionDenied: access.denied,
    supported,
    toggle,
  };
};
