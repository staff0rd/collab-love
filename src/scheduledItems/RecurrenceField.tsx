import { Fragment } from "react";

import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";

import type { Recurrence } from "./getScheduledItems.ts";
import IntervalStepper from "./IntervalStepper.tsx";
import { recurrenceLabel } from "./recurrenceLabel.ts";
import type { ScheduledItemFormState } from "./useScheduledItemForm.ts";

const OPTIONS: { value: Recurrence; label: string }[] = [
  { label: "Once", value: "once" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

const STEPPER_UNIT: Partial<Record<Recurrence, string>> = {
  daily: "day",
  monthly: "month",
  weekly: "week",
};

const variantFor = (selected: boolean): "default" | "outline" => {
  if (selected) {
    return "default";
  }
  return "outline";
};

const previewInterval = (recurrence: Recurrence, interval: number): number | null => {
  if (recurrence in STEPPER_UNIT) {
    return interval;
  }
  return null;
};

const OptionStepper = ({ value, form }: { value: Recurrence; form: ScheduledItemFormState }) => {
  const unit = STEPPER_UNIT[value];
  if (form.recurrence !== value || !unit) {
    return null;
  }
  return (
    <div className="col-span-2">
      <IntervalStepper interval={form.interval} unit={unit} onChange={form.setInterval} />
    </div>
  );
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
          <Fragment key={option.value}>
            <Button
              type="button"
              variant={variantFor(form.recurrence === option.value)}
              className="w-full"
              onClick={() => form.setRecurrence(option.value)}
            >
              {option.label}
            </Button>
            <OptionStepper value={option.value} form={form} />
          </Fragment>
        ))}
      </div>

      {preview && <p className="text-xs text-muted-foreground">{preview}</p>}
    </div>
  );
};

export default RecurrenceField;
