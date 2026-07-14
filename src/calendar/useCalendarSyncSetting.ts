import { useEffect, useState } from "react";

import { Capacitor } from "@capacitor/core";

import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

import { getCalendarSyncEnabled, setCalendarSyncEnabled } from "./calendarSyncPreference.ts";
import {
  clearMirroredEvents,
  type MirrorSummary,
  mirrorScheduledItems,
} from "./mirrorScheduledItems.ts";
import { requestCalendarAccess } from "./requestCalendarAccess.ts";

type Feedback = {
  error: string | null;
  permissionDenied: boolean;
  status: string | null;
};

const NO_FEEDBACK: Feedback = { error: null, permissionDenied: false, status: null };

const messageOf = (caught: unknown): string => {
  if (caught instanceof Error) {
    return caught.message;
  }
  return String(caught);
};

const describe = (summary: MirrorSummary): string => {
  let target = summary.calendarTitle;
  if (summary.calendarSource) {
    target = `${summary.calendarTitle} (${summary.calendarSource})`;
  }
  return `Synced ${summary.createdCount} new of ${summary.itemCount} into ${target}`;
};

export const useCalendarSyncSetting = (items: ScheduledItem[], loading: boolean) => {
  const supported = Capacitor.isNativePlatform();
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(NO_FEEDBACK);

  useEffect(() => {
    if (!supported) {
      return;
    }
    void getCalendarSyncEnabled().then(setEnabled);
  }, [supported]);

  const enableAndSync = async () => {
    if (!(await requestCalendarAccess())) {
      setFeedback({ ...NO_FEEDBACK, permissionDenied: true });
      return;
    }
    await setCalendarSyncEnabled(true);
    setEnabled(true);
    if (!loading) {
      setFeedback({ ...NO_FEEDBACK, status: describe(await mirrorScheduledItems(items)) });
    }
  };

  const disableAndClear = async () => {
    await setCalendarSyncEnabled(false);
    setEnabled(false);
    await clearMirroredEvents();
  };

  const toggle = async (next: boolean) => {
    setBusy(true);
    setFeedback(NO_FEEDBACK);
    try {
      if (next) {
        await enableAndSync();
      } else {
        await disableAndClear();
      }
    } catch (caught) {
      setFeedback({ ...NO_FEEDBACK, error: messageOf(caught) });
    } finally {
      setBusy(false);
    }
  };

  return {
    busy: busy || loading,
    enabled,
    error: feedback.error,
    permissionDenied: feedback.permissionDenied,
    status: feedback.status,
    supported,
    toggle,
  };
};
