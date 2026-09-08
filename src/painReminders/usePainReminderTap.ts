import { useEffect } from "react";
import { useNavigate } from "react-router";

import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

import { PAIN_REMINDER_IDS } from "./painReminderSchedule.ts";

const PAIN_LOG_PATH = "/home";

export const usePainReminderTap = (): void => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }
    const handle = LocalNotifications.addListener(
      "localNotificationActionPerformed",
      ({ notification }) => {
        if (PAIN_REMINDER_IDS.includes(notification.id)) {
          void navigate(PAIN_LOG_PATH);
        }
      },
    );
    return () => {
      void handle.then((listener) => listener.remove());
    };
  }, [navigate]);
};
