import { useEffect } from "react";

import { Capacitor } from "@capacitor/core";

import { useAuth } from "../auth/useAuth.ts";
import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

import { scheduledItemSnapshot } from "./scheduledItemSnapshot.ts";
import { writeScheduledItemSnapshot } from "./scheduledItemSnapshotStore.ts";

export const useWidgetSnapshot = (items: ScheduledItem[], ready: boolean): void => {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !ready || userId === null) {
      return;
    }
    writeScheduledItemSnapshot(scheduledItemSnapshot(items, userId, new Date())).catch((cause) => {
      console.error("Failed to write the widget snapshot", cause);
    });
  }, [items, ready, userId]);
};
