import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";

import type { Recurrence } from "./getScheduledItems.ts";
import { recurrenceLabel } from "./recurrenceLabel.ts";
import type { ScheduledItemFormState } from "./useScheduledItemForm.ts";

const MIN_INTERVAL = 1;
const RADIX = 10;

const OPTIONS: { value: Recurrence; label: string }[] = [
  { label: "Once", value: "once" },
  { label: "Weekly", value: "weekly" },
  { label: "Yearly", value: "yearly" },
  { label: "Twice a year", value: "half-yearly" },
  { label: "Before winter", value: "before-winter" },
  { label: "Before summer", value: "before-summer" },
];

const parseInterval = (value: string): number => {
  const parsed = Number.parseInt(value, RADIX);
  if (Number.isNaN(parsed)) {
    return MIN_INTERVAL;
  }
  return Math.max(MIN_INTERVAL, parsed);
};

const weeksLabel = (interval: number): string => {
  if (interval === MIN_INTERVAL) {
    return "week";
  }
  return "weeks";
};

const variantFor = (selected: boolean): "default" | "outline" => {
  if (selected) {
    return "default";
  }
  return "outline";
};

const previewInterval = (recurrence: Recurrence, interval: number): number | null => {
  if (recurrence === "weekly") {
    return interval;
  }
  return null;
};

const RecurrenceField = ({ form }: { form: ScheduledItemFormState }) => {
  const preview = recurrenceLabel({
    recurrence: form.recurrence,
    recurrenceInterval: previewInterval(form.recurrence, form.interval),
    scheduledAt: form.scheduledAt,
  });

  return (
    <div className="flex flex-col gap-2">
      <Label>Repeat</Label>
      <div className="grid grid-cols-2 gap-2">
        {OPTIONS.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={variantFor(form.recurrence === option.value)}
            className="w-full"
            onClick={() => form.setRecurrence(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {form.recurrence === "weekly" && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Every</span>
          <Input
            type="number"
            min={MIN_INTERVAL}
            aria-label="Weeks between occurrences"
            className="w-20"
            value={String(form.interval)}
            onChange={(event) => form.setInterval(parseInterval(event.target.value))}
          />
          <span className="text-sm text-muted-foreground">{weeksLabel(form.interval)}</span>
        </div>
      )}

      {preview && <p className="text-xs text-muted-foreground">{preview}</p>}
    </div>
  );
};

export default RecurrenceField;
