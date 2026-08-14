import { CalendarClock, ChevronDown, ChevronLeft } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";

import type { BumpScope } from "./bumpScheduledItem.ts";
import type { ScheduledItem } from "./getScheduledItems.ts";
import { snoozeLabel, snoozeOptions, type SnoozeTarget } from "./snoozeTarget.ts";

const scopeOptions: { label: string; scope: BumpScope }[] = [
  { label: "This occurrence", scope: "occurrence" },
  { label: "All occurrences", scope: "series" },
];

type ScheduledItemBumpMenuProps = {
  item: ScheduledItem;
  target: SnoozeTarget | null;
  onTargetChange: (target: SnoozeTarget | null) => void;
  onBump: (item: ScheduledItem, target: SnoozeTarget, scope: BumpScope) => void;
  onSelected: () => void;
};

const ScheduledItemBumpMenu = ({
  item,
  target,
  onTargetChange,
  onBump,
  onSelected,
}: ScheduledItemBumpMenuProps) => {
  const [expanded, setExpanded] = useState(false);

  const chooseTarget = (chosen: SnoozeTarget) => {
    if (item.recurrence === "once") {
      onSelected();
      onBump(item, chosen, "occurrence");
      return;
    }
    onTargetChange(chosen);
  };

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
            onClick={() => {
              onSelected();
              onBump(item, target, scope);
            }}
          >
            {label}
          </Button>
        ))}
      </>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        className="w-full justify-between"
        aria-expanded={expanded}
        onClick={() => setExpanded((current) => !current)}
      >
        <span className="flex items-center gap-2">
          <CalendarClock />
          Bump
        </span>
        <ChevronDown className={cn("size-4 transition-transform", expanded && "rotate-180")} />
      </Button>
      {expanded &&
        snoozeOptions.map(({ label, target: option }) => (
          <Button
            key={option}
            variant="ghost"
            className="w-full justify-start pl-9"
            onClick={() => chooseTarget(option)}
          >
            {label}
          </Button>
        ))}
    </>
  );
};

export default ScheduledItemBumpMenu;
