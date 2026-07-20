import { Capacitor } from "@capacitor/core";

import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

import { useCalendarSyncActions } from "./useCalendarSyncActions.ts";
import { useCalendarSyncState } from "./useCalendarSyncState.ts";
import { useCooldown } from "./useCooldown.ts";
import { useGuardedAction } from "./useGuardedAction.ts";

const RESYNC_COOLDOWN_SECONDS = 60;

export const useCalendarSyncSetting = (items: ScheduledItem[], loading: boolean) => {
  const supported = Capacitor.isNativePlatform();
  const { setState, state } = useCalendarSyncState(supported);
  const { busy, feedback, run, setFeedback } = useGuardedAction();
  const cooldown = useCooldown(RESYNC_COOLDOWN_SECONDS);
  const { chooseCalendar, resync, toggle } = useCalendarSyncActions({
    cooldownStart: cooldown.start,
    items,
    loading,
    run,
    selectedId: state.selectedId,
    setFeedback,
    setState,
  });

  return {
    busy: busy || loading,
    calendars: state.calendars,
    chooseCalendar,
    enabled: state.enabled,
    error: feedback.error,
    permissionDenied: feedback.permissionDenied,
    resync,
    resyncCooldown: cooldown.remaining,
    selectedId: state.selectedId,
    status: feedback.status,
    supported,
    toggle,
  };
};
