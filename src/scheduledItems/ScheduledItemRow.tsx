import { Pencil, Repeat, Trash2 } from "lucide-react";
import { Link } from "react-router";

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

import type { HouseholdMember } from "../household/getHousehold.ts";

import type { ScheduledItem } from "./getScheduledItems.ts";
import { nextOccurrence } from "./nextOccurrence.ts";
import { ownerLabel } from "./ownerLabel.ts";
import { recurrenceLabel } from "./recurrenceLabel.ts";
import { scheduledItemStatus, type ScheduledItemStatus } from "./scheduledItemStatus.ts";

const formatOccurrence = (value: Date) =>
  value.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

const rowStyles: Record<ScheduledItemStatus, string> = {
  overdue: "border-destructive/40 bg-destructive/5",
  today: "border-primary/40 bg-primary/5",
  upcoming: "border bg-card",
};

const timeStyles: Record<ScheduledItemStatus, string> = {
  overdue: "font-medium text-destructive",
  today: "font-medium text-primary",
  upcoming: "text-muted-foreground",
};

type ScheduledItemRowProps = {
  item: ScheduledItem;
  members: HouseholdMember[];
  onEdit: (item: ScheduledItem) => void;
  onDelete: (item: ScheduledItem) => void;
};

const DeleteItemButton = ({ item, onDelete }: Pick<ScheduledItemRowProps, "item" | "onDelete">) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button size="icon" variant="ghost" aria-label={`Delete ${item.title}`}>
        <Trash2 className="text-destructive" />
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
          onClick={() => onDelete(item)}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const ScheduledItemRow = ({ item, members, onEdit, onDelete }: ScheduledItemRowProps) => {
  const occurrence = nextOccurrence(item, new Date());
  const status = scheduledItemStatus(occurrence, new Date());
  const repeat = recurrenceLabel(item);
  const owner = ownerLabel(item.ownerUserId, members);

  return (
    <li
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 text-card-foreground",
        rowStyles[status],
      )}
    >
      <Link
        to={`/items/${item.id}`}
        className="flex min-w-0 flex-1 flex-col gap-1 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium">{item.title}</h3>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            {owner}
          </span>
        </div>
        <p className={cn("text-sm", timeStyles[status])}>{formatOccurrence(occurrence)}</p>
        {repeat && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Repeat className="size-3" />
            {repeat}
          </span>
        )}
        {item.notes && <p className="text-sm">{item.notes}</p>}
      </Link>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          aria-label={`Edit ${item.title}`}
          onClick={() => onEdit(item)}
        >
          <Pencil />
        </Button>
        <DeleteItemButton item={item} onDelete={onDelete} />
      </div>
    </li>
  );
};

export default ScheduledItemRow;
