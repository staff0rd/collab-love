import { useEffect, useState } from "react";

import { Capacitor } from "@capacitor/core";
import type { Calendar } from "@ebarooni/capacitor-calendar";

import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

import {
  describeMirror,
  disableCalendarSync,
  enableCalendarSync,
  loadEnabledSelection,
  mirrorInto,
  selectCalendarTarget,
} from "./calendarSyncOperations.ts";
import { NO_FEEDBACK, useGuardedAction } from "./useGuardedAction.ts";

type SyncState = {
  calendars: Calendar[];
  enabled: boolean;
  selectedId: string | null;
};

const INITIAL: SyncState = { calendars: [], enabled: false, selectedId: null };

export const useCalendarSyncSetting = (items: ScheduledItem[], loading: boolean) => {
  const supported = Capacitor.isNativePlatform();
  const [state, setState] = useState<SyncState>(INITIAL);
  const { busy, feedback, run, setFeedback } = useGuardedAction();

  useEffect(() => {
    if (!supported) {
      return;
    }
    void loadEnabledSelection().then((loaded) => {
      if (loaded) {
        setState({ ...loaded, enabled: true });
      }
    });
  }, [supported]);

  const mirrorAndReport = async () => {
    if (loading) {
      return;
    }
    const summary = await mirrorInto(items);
    setState((current) => ({ ...current, selectedId: summary.calendarId }));
    setFeedback({ ...NO_FEEDBACK, status: describeMirror(summary) });
  };

  const toggle = (next: boolean) =>
    run(async () => {
      if (!next) {
        await disableCalendarSync();
        setState((current) => ({ ...current, enabled: false }));
        return;
      }
      const loaded = await enableCalendarSync();
      if (!loaded) {
        setFeedback({ ...NO_FEEDBACK, permissionDenied: true });
        return;
      }
      setState({ ...loaded, enabled: true });
      await mirrorAndReport();
    });

  const chooseCalendar = (id: string) => {
    if (id === state.selectedId) {
      return Promise.resolve();
    }
    return run(async () => {
      await selectCalendarTarget(id);
      await mirrorAndReport();
    });
  };

  return {
    busy: busy || loading,
    calendars: state.calendars,
    chooseCalendar,
    enabled: state.enabled,
    error: feedback.error,
    permissionDenied: feedback.permissionDenied,
    selectedId: state.selectedId,
    status: feedback.status,
    supported,
    toggle,
  };
};
