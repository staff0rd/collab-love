import { useScheduledItems } from "../scheduledItems/useScheduledItems.ts";

import { useWidgetSnapshot } from "./useWidgetSnapshot.ts";

const WidgetSnapshotManager = () => {
  const { items, loading } = useScheduledItems();
  useWidgetSnapshot(items, loading);
  return null;
};

export default WidgetSnapshotManager;
