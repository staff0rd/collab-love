import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";

import type { BumpScope } from "./bumpScheduledItem.ts";
import type { Recurrence } from "./getScheduledItems.ts";
import { snoozeLabel, snoozeOptions, type SnoozeTarget } from "./snoozeTarget.ts";

export type BumpHandler = (target: SnoozeTarget, scope: BumpScope) => void;

const scopeOptions: { label: string; scope: BumpScope }[] = [
  { label: "This occurrence", scope: "occurrence" },
  { label: "All occurrences", scope: "series" },
];

type ScheduledItemBumpChoicesProps = {
  recurrence: Recurrence;
  target: SnoozeTarget | null;
  onTargetChange: (target: SnoozeTarget | null) => void;
  onBump: BumpHandler;
  optionClassName?: string;
};

const ScheduledItemBumpChoices = ({
  recurrence,
  target,
  onTargetChange,
  onBump,
  optionClassName,
}: ScheduledItemBumpChoicesProps) => {
  if (target) {
    return (
      <>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => onTargetChange(null)}
        >
          <ChevronLeft />
          {snoozeLabel(target)}
        </Button>
        {scopeOptions.map(({ label, scope }) => (
          <Button
            key={scope}
            variant="ghost"
            className="w-full justify-start pl-9"
            onClick={() => onBump(target, scope)}
          >
            {label}
          </Button>
        ))}
      </>
    );
  }

  const chooseTarget = (chosen: SnoozeTarget) => {
    if (recurrence === "once") {
      onBump(chosen, "occurrence");
      return;
    }
    onTargetChange(chosen);
  };

  return (
    <>
      {snoozeOptions.map(({ label, target: option }) => (
        <Button
          key={option}
          variant="ghost"
          className={cn("w-full justify-start", optionClassName)}
          onClick={() => chooseTarget(option)}
        >
          {label}
        </Button>
      ))}
    </>
  );
};

export default ScheduledItemBumpChoices;
