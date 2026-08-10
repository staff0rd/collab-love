import { Button } from "@/components/ui/button.tsx";

import { PAIN_RANGES, type PainRange, type PainRangeKey } from "./painRanges.ts";

const variantFor = (selected: boolean): "default" | "outline" => {
  if (selected) {
    return "default";
  }
  return "outline";
};

type PainRangeToggleProps = {
  value: PainRangeKey;
  onChange: (range: PainRange) => void;
};

const PainRangeToggle = ({ value, onChange }: PainRangeToggleProps) => (
  <div className="flex gap-2" role="group" aria-label="Chart range">
    {PAIN_RANGES.map((range) => {
      const selected = range.key === value;
      return (
        <Button
          key={range.key}
          type="button"
          size="sm"
          variant={variantFor(selected)}
          aria-pressed={selected}
          className="flex-1 sm:flex-none sm:px-6"
          onClick={() => onChange(range)}
        >
          {range.label}
        </Button>
      );
    })}
  </div>
);

export default PainRangeToggle;
