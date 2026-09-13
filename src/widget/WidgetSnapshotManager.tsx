import { useScheduledItems } from "../scheduledItems/useScheduledItems.ts";

import { useWidgetDeepLink } from "./useWidgetDeepLink.ts";
import { useWidgetSnapshot } from "./useWidgetSnapshot.ts";

const WidgetSnapshotManager = () => {
  const { error, items, loading } = useScheduledItems();
  const itemsLoaded = !loading && error === null;
  useWidgetSnapshot(items, itemsLoaded);
  useWidgetDeepLink();
  return null;
};

export default WidgetSnapshotManager;
