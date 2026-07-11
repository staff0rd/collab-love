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
import { cn } from "@/lib/utils.ts";

import {
  FEATURE_REQUEST_STATUS_LABELS,
  FEATURE_REQUEST_STATUS_STYLES,
  NEXT_FEATURE_REQUEST_STATUS,
} from "./featureRequestStatus.ts";
import type { FeatureRequest } from "./getFeatureRequests.ts";

type FeatureRequestRowProps = {
  item: FeatureRequest;
  onEdit: (item: FeatureRequest) => void;
  onAdvanceStatus: (item: FeatureRequest) => void;
  onDelete: (item: FeatureRequest) => void;
};

const StatusControl = ({
  item,
  onAdvanceStatus,
}: Pick<FeatureRequestRowProps, "item" | "onAdvanceStatus">) => {
  const next = NEXT_FEATURE_REQUEST_STATUS[item.status];
  const className = cn(
    "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
    FEATURE_REQUEST_STATUS_STYLES[item.status],
  );

  if (!next) {
    return <span className={className}>{FEATURE_REQUEST_STATUS_LABELS[item.status]}</span>;
  }

  return (
    <button
      type="button"
      className={cn(className, "cursor-pointer transition-opacity hover:opacity-80")}
      aria-label={`Advance status to ${FEATURE_REQUEST_STATUS_LABELS[next]}`}
      onClick={() => onAdvanceStatus(item)}
    >
      {FEATURE_REQUEST_STATUS_LABELS[item.status]}
    </button>
  );
};

const DeleteRequestButton = ({
  item,
  onDelete,
}: Pick<FeatureRequestRowProps, "item" | "onDelete">) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button size="icon" variant="ghost" aria-label={`Delete ${item.title}`}>
        <Trash2 className="text-destructive" />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete request?</AlertDialogTitle>
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

const FeatureRequestRow = ({ item, onEdit, onAdvanceStatus, onDelete }: FeatureRequestRowProps) => (
  <li className="flex flex-col gap-1.5 rounded-lg border bg-card p-4 text-card-foreground">
    <div className="flex items-start justify-between gap-2">
      <h3 className="min-w-0 flex-1 font-medium">{item.title}</h3>
      <StatusControl item={item} onAdvanceStatus={onAdvanceStatus} />
    </div>
    <p className="whitespace-pre-wrap text-sm text-muted-foreground">{item.description}</p>
    <div className="mt-1 flex items-center justify-end gap-1">
      <Button
        size="icon"
        variant="ghost"
        aria-label={`Edit ${item.title}`}
        onClick={() => onEdit(item)}
      >
        <Pencil />
      </Button>
      <DeleteRequestButton item={item} onDelete={onDelete} />
    </div>
  </li>
);

export default FeatureRequestRow;
