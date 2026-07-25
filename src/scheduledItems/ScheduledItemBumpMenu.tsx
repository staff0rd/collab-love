import { CalendarClock, ChevronDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";

import type { ScheduledItem } from "./getScheduledItems.ts";
import { snoozeOptions, type SnoozeTarget } from "./snoozeTarget.ts";

type ScheduledItemBumpMenuProps = {
  item: ScheduledItem;
  onBump: (item: ScheduledItem, target: SnoozeTarget) => void;
  onSelected: () => void;
};

const ScheduledItemBumpMenu = ({ item, onBump, onSelected }: ScheduledItemBumpMenuProps) => {
  const [expanded, setExpanded] = useState(false);

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
        snoozeOptions.map(({ label, target }) => (
          <Button
            key={target}
            variant="ghost"
            className="w-full justify-start pl-9"
            onClick={() => {
              onSelected();
              onBump(item, target);
            }}
          >
            {label}
          </Button>
        ))}
    </>
  );
};

export default ScheduledItemBumpMenu;
