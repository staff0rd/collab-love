import { Pencil, Repeat, Trash2 } from "lucide-react";

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
import { cn } from "@/lib/utils.ts";

import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";
import { nextOccurrence } from "../scheduledItems/nextOccurrence.ts";
import { recurrenceLabel } from "../scheduledItems/recurrenceLabel.ts";
import {
  scheduledItemStatus,
  type ScheduledItemStatus,
} from "../scheduledItems/scheduledItemStatus.ts";

const formatOccurrence = (value: Date) =>
  value.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" });

const statusLabels: Record<ScheduledItemStatus, string> = {
  overdue: "Overdue",
  today: "Today",
  upcoming: "Upcoming",
};

const statusStyles: Record<ScheduledItemStatus, string> = {
  overdue: "bg-destructive/10 text-destructive",
  today: "bg-primary/10 text-primary",
  upcoming: "bg-secondary text-secondary-foreground",
};

type ScheduledItemDetailBodyProps = {
  item: ScheduledItem;
  onEdit: () => void;
  onDelete: () => void;
};

const ScheduledItemDetailBody = ({ item, onEdit, onDelete }: ScheduledItemDetailBodyProps) => {
  const occurrence = nextOccurrence(item, new Date());
  const status = scheduledItemStatus(occurrence, new Date());
  const repeat = recurrenceLabel(item);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", statusStyles[status])}
        >
          {statusLabels[status]}
        </span>
        {item.owner && (
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">
            {item.owner}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{item.title}</h2>
        <p className="text-muted-foreground">{formatOccurrence(occurrence)}</p>
        {repeat && (
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Repeat className="size-4" />
            {repeat}
          </span>
        )}
      </div>

      {item.notes && <p className="whitespace-pre-wrap text-foreground">{item.notes}</p>}

      <div className="flex items-center gap-2 pt-2">
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
    </div>
  );
};

export default ScheduledItemDetailBody;
