import { useEffect } from "react";

import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";

import { useAuth } from "../auth/useAuth.ts";

import { registerDeviceToken } from "./registerDeviceToken.ts";

export const usePushToken = (): void => {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || userId === null) {
      return;
    }

    const handles = Promise.all([
      PushNotifications.addListener("registration", ({ value }) => {
        registerDeviceToken(userId, value).catch((cause) => {
          console.error("Failed to store the device push token", cause);
        });
      }),
      PushNotifications.addListener("registrationError", (cause) => {
        console.error("Failed to register for push notifications", cause);
      }),
    ]);

    PushNotifications.register().catch((cause) => {
      console.error("Failed to register for push notifications", cause);
    });

    return () => {
      void handles.then((listeners) => listeners.map((listener) => listener.remove()));
    };
  }, [userId]);
};
