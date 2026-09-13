import { useScheduledItems } from "../scheduledItems/useScheduledItems.ts";

import { useWidgetDeepLink } from "./useWidgetDeepLink.ts";
import { useWidgetSnapshot } from "./useWidgetSnapshot.ts";

const WidgetSnapshotManager = () => {
  const { items, loading } = useScheduledItems();
  useWidgetSnapshot(items, loading);
  useWidgetDeepLink();
  return null;
};

export default WidgetSnapshotManager;
