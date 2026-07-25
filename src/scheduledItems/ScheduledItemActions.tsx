import { Check, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";

import DeleteItemDialog from "./DeleteItemDialog.tsx";
import type { ScheduledItem } from "./getScheduledItems.ts";
import ScheduledItemBumpMenu from "./ScheduledItemBumpMenu.tsx";
import type { SnoozeTarget } from "./snoozeTarget.ts";

type ScheduledItemActionsProps = {
  item: ScheduledItem;
  onEdit: (item: ScheduledItem) => void;
  onDelete: (item: ScheduledItem) => void;
  onComplete: (item: ScheduledItem) => void;
  onBump: (item: ScheduledItem, target: SnoozeTarget) => void;
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

  const closeMenu = () => setMenuOpen(false);

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
        <PopoverContent align="end" className="w-40 p-1">
          {showComplete && (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                closeMenu();
                onComplete(item);
              }}
            >
              <Check />
              Mark done
            </Button>
          )}
          {showBump && <ScheduledItemBumpMenu item={item} onBump={onBump} onSelected={closeMenu} />}
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              closeMenu();
              onEdit(item);
            }}
          >
            <Pencil />
            Edit
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={() => {
              closeMenu();
              setConfirmOpen(true);
            }}
          >
            <Trash2 />
            Delete
          </Button>
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
