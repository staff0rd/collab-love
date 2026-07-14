import { Label } from "@/components/ui/label.tsx";
import { Switch } from "@/components/ui/switch.tsx";

import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

import { useCalendarSyncSetting } from "./useCalendarSyncSetting.ts";

const CalendarSyncField = ({ items, loading }: { items: ScheduledItem[]; loading: boolean }) => {
  const { busy, enabled, error, permissionDenied, supported, toggle } = useCalendarSyncSetting(
    items,
    loading,
  );

  if (!supported) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 border-t pt-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="calendar-sync">Apple Calendar sync</Label>
          <p className="text-sm text-muted-foreground">
            Mirror your scheduled items into the iOS Calendar on this device.
          </p>
        </div>
        <Switch
          id="calendar-sync"
          checked={enabled}
          disabled={busy}
          onCheckedChange={(next) => void toggle(next)}
        />
      </div>
      {permissionDenied && (
        <p className="text-sm text-destructive">
          Calendar access was denied. Enable it for collab-love in the iOS Settings app to sync.
        </p>
      )}
      {error && <p className="text-sm text-destructive">Couldn't sync to your calendar: {error}</p>}
    </div>
  );
};

export default CalendarSyncField;
