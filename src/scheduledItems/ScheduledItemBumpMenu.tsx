import { CalendarClock, ChevronDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";

import type { ScheduledItem } from "./getScheduledItems.ts";
import ScheduledItemBumpChoices, { type BumpHandler } from "./ScheduledItemBumpChoices.tsx";
import type { SnoozeTarget } from "./snoozeTarget.ts";

type ScheduledItemBumpMenuProps = {
  item: ScheduledItem;
  target: SnoozeTarget | null;
  onTargetChange: (target: SnoozeTarget | null) => void;
  onBump: BumpHandler;
};

const ScheduledItemBumpMenu = ({
  item,
  target,
  onTargetChange,
  onBump,
}: ScheduledItemBumpMenuProps) => {
  const [expanded, setExpanded] = useState(false);

  const choices = (
    <ScheduledItemBumpChoices
      recurrence={item.recurrence}
      target={target}
      onTargetChange={onTargetChange}
      onBump={onBump}
      optionClassName="pl-9"
    />
  );

  if (target) {
    return choices;
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
      {expanded && choices}
    </>
  );
};

export default ScheduledItemBumpMenu;
