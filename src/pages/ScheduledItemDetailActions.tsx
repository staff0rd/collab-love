import { CalendarClock, Check, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";

import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";
import ScheduledItemBumpChoices, {
  type BumpHandler,
} from "../scheduledItems/ScheduledItemBumpChoices.tsx";
import type { SnoozeTarget } from "../scheduledItems/snoozeTarget.ts";

type ScheduledItemDetailActionsProps = {
  item: ScheduledItem;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  onBump: BumpHandler;
};

const ScheduledItemDetailActions = ({
  item,
  onEdit,
  onDelete,
  onComplete,
  onBump,
}: ScheduledItemDetailActionsProps) => {
  const [bumpOpen, setBumpOpen] = useState(false);
  const [bumpTarget, setBumpTarget] = useState<SnoozeTarget | null>(null);

  const closeBump = () => {
    setBumpOpen(false);
    setBumpTarget(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setBumpOpen(true);
      return;
    }
    closeBump();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <Button variant="outline" onClick={onComplete}>
        <Check />
        Mark done
      </Button>
      <Popover open={bumpOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <CalendarClock />
            Bump
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-48 p-1">
          <ScheduledItemBumpChoices
            recurrence={item.recurrence}
            target={bumpTarget}
            onTargetChange={setBumpTarget}
            onBump={(target, scope) => {
              closeBump();
              onBump(target, scope);
            }}
          />
        </PopoverContent>
      </Popover>
      <Button variant="outline" onClick={onEdit}>
        <Pencil />
        Edit
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">
            <Trash2 className="text-destructive" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete item?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{item.title}&rdquo; will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={onDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ScheduledItemDetailActions;
