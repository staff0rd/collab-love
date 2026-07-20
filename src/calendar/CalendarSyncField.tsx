import { Label } from "@/components/ui/label.tsx";
import { Switch } from "@/components/ui/switch.tsx";

import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

import CalendarResyncButton from "./CalendarResyncButton.tsx";
import { calendarOptionLabel, selectedOptionValue } from "./calendarOption.ts";
import { useCalendarSyncSetting } from "./useCalendarSyncSetting.ts";

const NO_CALENDARS = 0;

const CalendarSyncField = ({ items, loading }: { items: ScheduledItem[]; loading: boolean }) => {
  const {
    busy,
    calendars,
    chooseCalendar,
    enabled,
    error,
    permissionDenied,
    resync,
    resyncCooldown,
    selectedId,
    status,
    supported,
    toggle,
  } = useCalendarSyncSetting(items, loading);

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
      {enabled && calendars.length > NO_CALENDARS && (
        <div className="flex flex-col gap-1">
          <Label htmlFor="calendar-target">Calendar</Label>
          <select
            id="calendar-target"
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={selectedOptionValue(calendars, selectedId)}
            disabled={busy}
            onChange={(event) => void chooseCalendar(event.target.value)}
          >
            {calendars.map((calendar) => (
              <option key={calendar.id} value={calendar.id}>
                {calendarOptionLabel(calendar)}
              </option>
            ))}
          </select>
          <p className="text-sm text-muted-foreground">
            Events are added to this calendar. Pick one that's visible in the Calendar app.
          </p>
        </div>
      )}
      {enabled && (
        <CalendarResyncButton
          busy={busy}
          cooldown={resyncCooldown}
          onResync={() => void resync()}
        />
      )}
      {permissionDenied && (
        <p className="text-sm text-destructive">
          Calendar access was denied. Enable it for collab-love in the iOS Settings app to sync.
        </p>
      )}
      {error && <p className="text-sm text-destructive">Couldn't sync to your calendar: {error}</p>}
      {status && <p className="text-sm text-muted-foreground">{status}</p>}
    </div>
  );
};

export default CalendarSyncField;
