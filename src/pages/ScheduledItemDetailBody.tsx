import { Repeat } from "lucide-react";

import { cn } from "@/lib/utils.ts";

import type { HouseholdMember } from "../household/getHousehold.ts";
import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";
import { nextOccurrence } from "../scheduledItems/nextOccurrence.ts";
import { ownerLabel } from "../scheduledItems/ownerLabel.ts";
import { recurrenceLabel } from "../scheduledItems/recurrenceLabel.ts";
import {
  scheduledItemStatus,
  type ScheduledItemStatus,
} from "../scheduledItems/scheduledItemStatus.ts";

import ScheduledItemDetailActions from "./ScheduledItemDetailActions.tsx";

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
  members: HouseholdMember[];
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
};

const ScheduledItemDetailBody = ({
  item,
  members,
  onEdit,
  onDelete,
  onComplete,
}: ScheduledItemDetailBodyProps) => {
  const occurrence = nextOccurrence(item, new Date());
  const status = scheduledItemStatus(occurrence, new Date());
  const repeat = recurrenceLabel(item);
  const owner = ownerLabel(item.ownerUserId, members);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", statusStyles[status])}
        >
          {statusLabels[status]}
        </span>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">
          {owner}
        </span>
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

      <ScheduledItemDetailActions
        title={item.title}
        onEdit={onEdit}
        onDelete={onDelete}
        onComplete={onComplete}
      />
    </div>
  );
};

export default ScheduledItemDetailBody;
