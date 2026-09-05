import { Label } from "@/components/ui/label.tsx";
import { Switch } from "@/components/ui/switch.tsx";

import { useMigraineCardSetting } from "./useMigraineCardSetting.ts";

const MigraineCardField = () => {
  const { busy, enabled, error, toggle } = useMigraineCardSetting();

  return (
    <div className="flex flex-col gap-2 border-t pt-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="migraine-card">Migraine log card</Label>
          <p className="text-sm text-muted-foreground">
            Show the weekday migraine log on Home. The migraine overview stays in the menu either
            way.
          </p>
        </div>
        <Switch
          id="migraine-card"
          checked={enabled}
          disabled={busy}
          onCheckedChange={(next) => void toggle(next)}
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">Couldn't update the migraine card: {error}</p>
      )}
    </div>
  );
};

export default MigraineCardField;
