import { useEffect } from "react";

import { Capacitor } from "@capacitor/core";

import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

import { getCalendarSyncEnabled } from "./calendarSyncPreference.ts";
import { mirrorScheduledItems } from "./mirrorScheduledItems.ts";

export const useCalendarSync = (items: ScheduledItem[], loading: boolean): void => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || loading) {
      return;
    }
    void (async () => {
      if (await getCalendarSyncEnabled()) {
        await mirrorScheduledItems(items);
      }
    })();
  }, [items, loading]);
};
