import { ChevronRight, Pill } from "lucide-react";

import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";

import { PAIN_LEVEL_FOREGROUND, painLevelColor } from "./painLevelColor.ts";
import type { PainSlotState } from "./painSlotStates.ts";

const ROW_CLASSES = "flex min-h-15 w-full items-center gap-3 px-4 py-2.5 text-left text-[15px]";
const TIME_CLASSES = "w-21 shrink-0 tabular-nums";

type PainSlotRowProps = {
  state: PainSlotState;
  onRecord: () => void;
};

const PainSlotRow = ({ state, onRecord }: PainSlotRowProps) => {
  const { slot, reading } = state;

  if (reading) {
    return (
      <button
        type="button"
        onClick={onRecord}
        aria-label={`Edit the ${slot.label} reading, level ${reading.level}`}
        className={cn(
          ROW_CLASSES,
          "transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        )}
      >
        <span className={cn(TIME_CLASSES, "font-medium")}>{slot.label}</span>
        <span
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-[17px] font-semibold tabular-nums"
          style={{ background: painLevelColor(reading.level), color: PAIN_LEVEL_FOREGROUND }}
        >
          {reading.level}
        </span>
        {reading.extraMedication && (
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/[0.12] px-2 py-0.5 text-xs font-medium text-destructive">
            <Pill className="size-3 shrink-0" />
            Extra med
          </span>
        )}
        <ChevronRight className="ml-auto size-[18px] shrink-0 text-muted-foreground" />
      </button>
    );
  }

  if (state.status === "pending") {
    return (
      <div className={cn(ROW_CLASSES, "bg-primary/[0.06]")}>
        <span className={cn(TIME_CLASSES, "font-medium")}>{slot.label}</span>
        <Button
          size="sm"
          className="ml-auto"
          onClick={onRecord}
          aria-label={`Record the ${slot.label} reading`}
        >
          Record
        </Button>
      </div>
    );
  }

  return (
    <div className={ROW_CLASSES} aria-disabled="true">
      <span className={cn(TIME_CLASSES, "text-muted-foreground")}>{slot.label}</span>
      <span className="ml-auto text-sm text-muted-foreground">Upcoming</span>
    </div>
  );
};

export default PainSlotRow;
