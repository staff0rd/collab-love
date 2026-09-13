import { MoreVertical } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";

import DeleteItemDialog from "./DeleteItemDialog.tsx";
import type { ScheduledItem } from "./getScheduledItems.ts";
import type { ScheduledItemActionHandlers } from "./scheduledItemActionHandlers.ts";
import ScheduledItemActionsMenu from "./ScheduledItemActionsMenu.tsx";

type ScheduledItemActionsProps = ScheduledItemActionHandlers & {
  item: ScheduledItem;
  showComplete?: boolean;
  showBump?: boolean;
};

export const ScheduledItemActions = ({
  item,
  onEdit,
  onDelete,
  onComplete,
  onBump,
  showComplete = true,
  showBump = false,
}: ScheduledItemActionsProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="size-8 shrink-0"
            aria-label={`Actions for ${item.title}`}
          >
            <MoreVertical />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-48 p-1">
          <ScheduledItemActionsMenu
            item={item}
            showComplete={showComplete}
            showBump={showBump}
            onEdit={onEdit}
            onComplete={onComplete}
            onBump={onBump}
            onDeleteRequest={() => setConfirmOpen(true)}
            onClose={() => setMenuOpen(false)}
          />
        </PopoverContent>
      </Popover>
      <DeleteItemDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={item.title}
        onConfirm={() => onDelete(item)}
      />
    </>
  );
};
