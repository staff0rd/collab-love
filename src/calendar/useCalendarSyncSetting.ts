import { useEffect, useState } from "react";

import { Capacitor } from "@capacitor/core";

import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

import { getCalendarSyncEnabled, setCalendarSyncEnabled } from "./calendarSyncPreference.ts";
import { clearMirroredEvents, mirrorScheduledItems } from "./mirrorScheduledItems.ts";
import { requestCalendarAccess } from "./requestCalendarAccess.ts";

const messageOf = (caught: unknown): string => {
  if (caught instanceof Error) {
    return caught.message;
  }
  return String(caught);
};

export const useCalendarSyncSetting = (items: ScheduledItem[], loading: boolean) => {
  const supported = Capacitor.isNativePlatform();
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const toggle = async (next: boolean) => {
    setBusy(true);
    setPermissionDenied(false);
    setError(null);
    try {
      if (next) {
        await enableAndSync();
      } else {
        await disableAndClear();
      }
    } catch (caught) {
      setError(messageOf(caught));
    } finally {
      setBusy(false);
    }
  };

  return { busy: busy || loading, enabled, error, permissionDenied, supported, toggle };
};
