import { Label } from "@/components/ui/label.tsx";
import { Switch } from "@/components/ui/switch.tsx";

import { usePainReminderSetting } from "./usePainReminderSetting.ts";

const PainReminderField = () => {
  const { busy, enabled, error, permissionDenied, supported, toggle } = usePainReminderSetting();

  if (!supported) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 border-t pt-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="pain-reminders">Pain log reminders</Label>
          <p className="text-sm text-muted-foreground">
            Remind this device two hours after a pain reading is due, unless it's already recorded.
          </p>
        </div>
        <Switch
          id="pain-reminders"
          checked={enabled}
          disabled={busy}
          onCheckedChange={(next) => void toggle(next)}
        />
      </div>
      {permissionDenied && (
        <p className="text-sm text-destructive">
          Notifications were denied. Enable them for collab-love in the iOS Settings app to get
          reminders.
        </p>
      )}
      {error && <p className="text-sm text-destructive">Couldn't update reminders: {error}</p>}
    </div>
  );
};

export default PainReminderField;
