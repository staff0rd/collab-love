import { Capacitor } from "@capacitor/core";

import type { ScheduledItemSnapshot } from "./scheduledItemSnapshot.ts";
import { WidgetBridge } from "./widgetBridge.ts";

let writtenEntries: string | null = null;

export const writeScheduledItemSnapshot = async (
  snapshot: ScheduledItemSnapshot,
): Promise<void> => {
  const entries = JSON.stringify(snapshot.entries);
  if (entries === writtenEntries) {
    return;
  }
  await WidgetBridge.setSnapshot({ value: JSON.stringify(snapshot) });
  writtenEntries = entries;
  await WidgetBridge.reload();
};

export const clearScheduledItemSnapshot = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    return;
  }
  await WidgetBridge.clearSnapshot();
  writtenEntries = null;
  await WidgetBridge.reload();
};
