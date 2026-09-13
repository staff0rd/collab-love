import DataStates from "../components/DataStates.tsx";
import type { HouseholdMember } from "../household/getHousehold.ts";

import type { ScheduledItem } from "./getScheduledItems.ts";
import { groupScheduledItems } from "./groupScheduledItems.ts";
import type { ScheduledItemActionHandlers } from "./scheduledItemActionHandlers.ts";
import ScheduledItemRow from "./ScheduledItemRow.tsx";

const EMPTY_COUNT = 0;

const emptyCopy = (filtered: boolean) => {
  if (filtered) {
    return { description: "Try a different person.", title: "Nothing for this filter" };
  }
  return { description: "Add your first item to get started.", title: "Nothing scheduled yet" };
};

type ScheduledItemListProps = ScheduledItemActionHandlers & {
  items: ScheduledItem[];
  members: HouseholdMember[];
  loading: boolean;
  error?: unknown;
  filtered?: boolean;
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
  onBump,
}: ScheduledItemListProps) => {
  const groups = groupScheduledItems(items, new Date());
  const empty = emptyCopy(filtered);

  return (
    <DataStates
      loading={loading}
      error={error}
      empty={items.length === EMPTY_COUNT}
      errorTitle="Couldn't load scheduled items"
      emptyTitle={empty.title}
      emptyDescription={empty.description}
    >
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
                  onBump={onBump}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </DataStates>
  );
};

export default ScheduledItemList;
