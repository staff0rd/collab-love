import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";

import type { OwnerFilterOption } from "./ownerFilterOptions.ts";

const variantFor = (selected: boolean): "default" | "outline" => {
  if (selected) {
    return "default";
  }
  return "outline";
};

const countStyle = (selected: boolean): string => {
  if (selected) {
    return "bg-primary-foreground/20";
  }
  return "bg-muted text-muted-foreground";
};

type OwnerFilterBarProps = {
  options: OwnerFilterOption[];
  value: string;
  onChange: (key: string) => void;
};

const OwnerFilterBar = ({ options, value, onChange }: OwnerFilterBarProps) => (
  <div
    className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4"
    role="group"
    aria-label="Filter by owner"
  >
    {options.map((option) => {
      const selected = option.key === value;
      return (
        <Button
          key={option.key}
          type="button"
          size="sm"
          variant={variantFor(selected)}
          aria-pressed={selected}
          className="shrink-0"
          onClick={() => onChange(option.key)}
        >
          {option.label}
          <span
            className={cn("ml-1 rounded-full px-1.5 text-xs tabular-nums", countStyle(selected))}
          >
            {option.count}
          </span>
        </Button>
      );
    })}
  </div>
);

export default OwnerFilterBar;
