import { Pencil, Trash2 } from "lucide-react";

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

import type { ScheduledItem } from "./getScheduledItems.ts";

const formatScheduledAt = (value: string) =>
  new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

type ScheduledItemRowProps = {
  item: ScheduledItem;
  onEdit: (item: ScheduledItem) => void;
  onDelete: (item: ScheduledItem) => void;
};

const DeleteItemButton = ({ item, onDelete }: Omit<ScheduledItemRowProps, "onEdit">) => (
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

const ScheduledItemRow = ({ item, onEdit, onDelete }: ScheduledItemRowProps) => (
  <li className="flex items-start gap-3 rounded-lg border bg-card p-4 text-card-foreground">
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-medium">{item.title}</h3>
        {item.owner && (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            {item.owner}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{formatScheduledAt(item.scheduledAt)}</p>
      {item.notes && <p className="text-sm">{item.notes}</p>}
    </div>
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

export default ScheduledItemRow;
