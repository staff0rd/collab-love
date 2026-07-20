import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Switch } from "@/components/ui/switch.tsx";

import type { ScheduledItemFormState } from "./useScheduledItemForm.ts";

const MIN_DAYS = 1;
const DEFAULT_DAYS = 3;
const STEP = 1;
const RADIX = 10;

const clampDays = (value: number): number => Math.max(MIN_DAYS, Math.trunc(value));

const dayLabel = (days: number): string => {
  if (days === MIN_DAYS) {
    return "day before";
  }
  return "days before";
};

const ReminderStepper = ({
  days,
  onChange,
}: {
  days: number;
  onChange: (value: number) => void;
}) => {
  const [draft, setDraft] = useState(String(days));

  const edit = (raw: string) => {
    setDraft(raw);
    const parsed = Number.parseInt(raw, RADIX);
    if (!Number.isNaN(parsed) && parsed >= MIN_DAYS) {
      onChange(parsed);
    }
  };

  const step = (delta: number) => {
    const next = clampDays(days + delta);
    setDraft(String(next));
    onChange(next);
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/5 p-3">
      <span className="text-sm">Remind</span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Fewer days before"
        disabled={days <= MIN_DAYS}
        onClick={() => step(-STEP)}
      >
        <Minus />
      </Button>
      <Input
        type="number"
        inputMode="numeric"
        min={MIN_DAYS}
        aria-label="Days before the item"
        className="w-16 text-center"
        value={draft}
        onChange={(event) => edit(event.target.value)}
        onBlur={() => setDraft(String(days))}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="More days before"
        onClick={() => step(STEP)}
      >
        <Plus />
      </Button>
      <span className="text-sm text-muted-foreground">{dayLabel(days)}</span>
    </div>
  );
};

const ReminderField = ({ form }: { form: ScheduledItemFormState }) => {
  const enabled = form.reminderDaysBefore !== null;

  const toggle = (next: boolean) => {
    if (next) {
      form.setReminderDaysBefore(DEFAULT_DAYS);
      return;
    }
    form.setReminderDaysBefore(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="scheduled-item-reminder">Reminder</Label>
        <Switch id="scheduled-item-reminder" checked={enabled} onCheckedChange={toggle} />
      </div>

      {enabled && (
        <ReminderStepper
          days={form.reminderDaysBefore ?? DEFAULT_DAYS}
          onChange={form.setReminderDaysBefore}
        />
      )}
    </div>
  );
};

export default ReminderField;
