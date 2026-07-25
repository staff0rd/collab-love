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

import { snoozeOptions, type SnoozeTarget } from "../scheduledItems/snoozeTarget.ts";

type ScheduledItemDetailActionsProps = {
  title: string;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  onBump: (target: SnoozeTarget) => void;
};

const ScheduledItemDetailActions = ({
  title,
  onEdit,
  onDelete,
  onComplete,
  onBump,
}: ScheduledItemDetailActionsProps) => {
  const [bumpOpen, setBumpOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <Button variant="outline" onClick={onComplete}>
        <Check />
        Mark done
      </Button>
      <Popover open={bumpOpen} onOpenChange={setBumpOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <CalendarClock />
            Bump
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-44 p-1">
          {snoozeOptions.map(({ label, target }) => (
            <Button
              key={target}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setBumpOpen(false);
                onBump(target);
              }}
            >
              {label}
            </Button>
          ))}
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
              &ldquo;{title}&rdquo; will be permanently removed.
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
