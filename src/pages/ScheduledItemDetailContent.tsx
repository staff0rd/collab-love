import { Loader2 } from "lucide-react";

import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

import ScheduledItemDetailBody from "./ScheduledItemDetailBody.tsx";

type ScheduledItemDetailContentProps = {
  item: ScheduledItem | null;
  loading: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

const ScheduledItemDetailContent = ({
  item,
  loading,
  onEdit,
  onDelete,
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

  return <ScheduledItemDetailBody item={item} onEdit={onEdit} onDelete={onDelete} />;
};

export default ScheduledItemDetailContent;
