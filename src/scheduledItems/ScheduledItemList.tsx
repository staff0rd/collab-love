import { Loader2 } from "lucide-react";

import type { ScheduledItem } from "./getScheduledItems.ts";
import { groupScheduledItems } from "./groupScheduledItems.ts";
import ScheduledItemRow from "./ScheduledItemRow.tsx";

const EMPTY_COUNT = 0;

type ScheduledItemListProps = {
  items: ScheduledItem[];
  loading: boolean;
  onEdit: (item: ScheduledItem) => void;
  onDelete: (item: ScheduledItem) => void;
};

const ScheduledItemList = ({ items, loading, onEdit, onDelete }: ScheduledItemListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-16 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (items.length === EMPTY_COUNT) {
    return (
      <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed py-16 text-center">
        <p className="font-medium">Nothing scheduled yet</p>
        <p className="text-sm text-muted-foreground">Add your first item to get started.</p>
      </div>
    );
  }

  const groups = groupScheduledItems(items, new Date());

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.key} className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {group.label}
          </h3>
          <ul className="flex flex-col gap-2">
            {group.items.map((item) => (
              <ScheduledItemRow key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default ScheduledItemList;
