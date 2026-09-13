import type { ScheduledItemSnapshot } from "./scheduledItemSnapshot.ts";
import { WidgetBridge } from "./widgetBridge.ts";

export const writeScheduledItemSnapshot = async (
  snapshot: ScheduledItemSnapshot,
): Promise<void> => {
  await WidgetBridge.setSnapshot({ value: JSON.stringify(snapshot) });
};
