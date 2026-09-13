import { useEffect } from "react";

import { Capacitor } from "@capacitor/core";

import { useAuth } from "../auth/useAuth.ts";
import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

import { scheduledItemSnapshot } from "./scheduledItemSnapshot.ts";
import { writeScheduledItemSnapshot } from "./scheduledItemSnapshotStore.ts";

export const useWidgetSnapshot = (items: ScheduledItem[], loading: boolean): void => {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || loading || userId === null) {
      return;
    }
    writeScheduledItemSnapshot(scheduledItemSnapshot(items, userId, new Date())).catch((cause) => {
      console.error("Failed to write the widget snapshot", cause);
    });
  }, [items, loading, userId]);
};
