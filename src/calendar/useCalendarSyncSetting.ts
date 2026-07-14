import { useEffect, useState } from "react";

import { Capacitor } from "@capacitor/core";

import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

import { getCalendarSyncEnabled, setCalendarSyncEnabled } from "./calendarSyncPreference.ts";
import { clearMirroredEvents, mirrorScheduledItems } from "./mirrorScheduledItems.ts";
import { requestCalendarAccess } from "./requestCalendarAccess.ts";

export const useCalendarSyncSetting = (items: ScheduledItem[], loading: boolean) => {
  const supported = Capacitor.isNativePlatform();
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    if (!supported) {
      return;
    }
    void getCalendarSyncEnabled().then(setEnabled);
  }, [supported]);

  const enableAndSync = async () => {
    if (!(await requestCalendarAccess())) {
      setPermissionDenied(true);
      return;
    }
    await setCalendarSyncEnabled(true);
    setEnabled(true);
    if (!loading) {
      await mirrorScheduledItems(items);
    }
  };

  const disableAndClear = async () => {
    await setCalendarSyncEnabled(false);
    setEnabled(false);
    await clearMirroredEvents();
  };

  const setEnabledAndSync = async (next: boolean) => {
    if (next) {
      await enableAndSync();
      return;
    }
    await disableAndClear();
  };

  const toggle = async (next: boolean) => {
    setBusy(true);
    setPermissionDenied(false);
    try {
      await setEnabledAndSync(next);
    } finally {
      setBusy(false);
    }
  };

  return { busy: busy || loading, enabled, permissionDenied, supported, toggle };
};
