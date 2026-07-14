import { Loader2 } from "lucide-react";

import type { HouseholdMember } from "../household/getHousehold.ts";
import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

import ScheduledItemDetailBody from "./ScheduledItemDetailBody.tsx";

type ScheduledItemDetailContentProps = {
  item: ScheduledItem | null;
  members: HouseholdMember[];
  loading: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
};

const ScheduledItemDetailContent = ({
  item,
  members,
  loading,
  onEdit,
  onDelete,
  onComplete,
}: ScheduledItemDetailContentProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-16 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed py-16 text-center">
        <p className="font-medium">Item not found</p>
        <p className="text-sm text-muted-foreground">It may have been deleted.</p>
      </div>
    );
  }

  return (
    <ScheduledItemDetailBody
      item={item}
      members={members}
      onEdit={onEdit}
      onDelete={onDelete}
      onComplete={onComplete}
    />
  );
};

export default ScheduledItemDetailContent;
