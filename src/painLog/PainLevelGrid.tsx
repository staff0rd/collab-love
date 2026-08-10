import type { CSSProperties } from "react";

import { cn } from "@/lib/utils.ts";

import { PAIN_LEVEL_FOREGROUND, painLevelColor } from "./painLevelColor.ts";

const LEVEL_COUNT = 11;

const PAIN_LEVELS = [...Array(LEVEL_COUNT).keys()];

const CELL_CLASSES =
  "h-13 rounded-lg border text-base font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-11 sm:text-[15px]";

const selectionClasses = (selected: boolean) => {
  if (selected) {
    return "border-transparent font-semibold";
  }
  return "border-input hover:bg-accent";
};

const selectionStyle = (level: number, selected: boolean): CSSProperties | undefined => {
  if (!selected) {
    return undefined;
  }
  return { background: painLevelColor(level), color: PAIN_LEVEL_FOREGROUND };
};

type PainLevelGridProps = {
  value: number | null;
  labelledBy: string;
  onChange: (level: number) => void;
};

const PainLevelGrid = ({ value, labelledBy, onChange }: PainLevelGridProps) => (
  <div
    role="group"
    aria-labelledby={labelledBy}
    className="grid grid-cols-6 gap-1.5 sm:grid-cols-11"
  >
    {PAIN_LEVELS.map((level) => {
      const selected = level === value;
      return (
        <button
          key={level}
          type="button"
          aria-pressed={selected}
          onClick={() => onChange(level)}
          className={cn(CELL_CLASSES, selectionClasses(selected))}
          style={selectionStyle(level, selected)}
        >
          {level}
        </button>
      );
    })}
  </div>
);

export default PainLevelGrid;
