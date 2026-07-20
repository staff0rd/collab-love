import { AlertTriangle, Loader2 } from "lucide-react";

import type { HouseholdMember } from "../household/getHousehold.ts";

import type { ScheduledItem } from "./getScheduledItems.ts";
import { groupScheduledItems } from "./groupScheduledItems.ts";
import ScheduledItemRow from "./ScheduledItemRow.tsx";

const EMPTY_COUNT = 0;

const errorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Something went wrong.";
};

const ErrorState = ({ error }: { error: unknown }) => (
  <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed border-destructive/40 bg-destructive/5 py-16 text-center">
    <AlertTriangle className="mb-1 size-6 text-destructive" />
    <p className="font-medium">Couldn&apos;t load scheduled items</p>
    <p className="max-w-xs text-sm text-muted-foreground">{errorMessage(error)}</p>
  </div>
);

const EmptyState = ({ filtered }: { filtered: boolean }) => {
  if (filtered) {
    return (
      <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed py-16 text-center">
        <p className="font-medium">Nothing for this filter</p>
        <p className="text-sm text-muted-foreground">Try a different person.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed py-16 text-center">
      <p className="font-medium">Nothing scheduled yet</p>
      <p className="text-sm text-muted-foreground">Add your first item to get started.</p>
    </div>
  );
};

type ScheduledItemListProps = {
  items: ScheduledItem[];
  members: HouseholdMember[];
  loading: boolean;
  error?: unknown;
  filtered?: boolean;
  onEdit: (item: ScheduledItem) => void;
  onDelete: (item: ScheduledItem) => void;
  onComplete: (item: ScheduledItem) => void;
};

const ScheduledItemList = ({
  items,
  members,
  loading,
  error,
  filtered = false,
  onEdit,
  onDelete,
  onComplete,
}: ScheduledItemListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-16 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (items.length === EMPTY_COUNT) {
    return <EmptyState filtered={filtered} />;
  }

  const groups = groupScheduledItems(items, new Date());

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.key} className="flex flex-col gap-2">
          <h3 className="flex items-baseline justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>{group.label}</span>
            {group.relativeLabel && (
              <span className="font-normal normal-case">{group.relativeLabel}</span>
            )}
          </h3>
          <ul className="flex flex-col gap-2">
            {group.entries.map((entry) => (
              <ScheduledItemRow
                key={entry.key}
                entry={entry}
                members={members}
                onEdit={onEdit}
                onDelete={onDelete}
                onComplete={onComplete}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default ScheduledItemList;
