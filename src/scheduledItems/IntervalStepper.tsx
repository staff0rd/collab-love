import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

const MIN_INTERVAL = 1;
const STEP = 1;
const RADIX = 10;

const clampInterval = (value: number): number => Math.max(MIN_INTERVAL, Math.trunc(value));

const unitLabel = (unit: string, interval: number): string => {
  if (interval === MIN_INTERVAL) {
    return unit;
  }
  return `${unit}s`;
};

const IntervalStepper = ({
  interval,
  unit,
  onChange,
}: {
  interval: number;
  unit: string;
  onChange: (value: number) => void;
}) => {
  const [draft, setDraft] = useState(String(interval));

  const edit = (raw: string) => {
    setDraft(raw);
    const parsed = Number.parseInt(raw, RADIX);
    if (!Number.isNaN(parsed) && parsed >= MIN_INTERVAL) {
      onChange(parsed);
    }
  };

  const step = (delta: number) => {
    const next = clampInterval(interval + delta);
    setDraft(String(next));
    onChange(next);
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/5 p-3">
      <span className="text-sm">Repeat every</span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={`Fewer ${unit}s`}
        disabled={interval <= MIN_INTERVAL}
        onClick={() => step(-STEP)}
      >
        <Minus />
      </Button>
      <Input
        type="number"
        inputMode="numeric"
        min={MIN_INTERVAL}
        aria-label={`${unit}s between occurrences`}
        className="w-16 text-center"
        value={draft}
        onChange={(event) => edit(event.target.value)}
        onBlur={() => setDraft(String(interval))}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={`More ${unit}s`}
        onClick={() => step(STEP)}
      >
        <Plus />
      </Button>
      <span className="text-sm text-muted-foreground">{unitLabel(unit, interval)}</span>
    </div>
  );
};

export default IntervalStepper;
