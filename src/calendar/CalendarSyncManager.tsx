import { useScheduledItems } from "../scheduledItems/useScheduledItems.ts";

import { useCalendarSync } from "./useCalendarSync.ts";

const CalendarSyncManager = () => {
  const { items, loading } = useScheduledItems();
  useCalendarSync(items, loading);
  return null;
};

export default CalendarSyncManager;
