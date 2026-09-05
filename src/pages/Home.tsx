import { useState } from "react";

import { useAuth } from "../auth/useAuth.ts";
import { useHousehold } from "../household/useHousehold.ts";
import { useScrollRestoration } from "../lib/useScrollRestoration.ts";
import TodayMigraineLog from "../migraineLog/TodayMigraineLog.tsx";
import TodayPainLog from "../painLog/TodayPainLog.tsx";
import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";
import { ALL_FILTER_KEY } from "../scheduledItems/ownerFilterOptions.ts";
import OwnerFilterBar from "../scheduledItems/OwnerFilterBar.tsx";
import ScheduledItemList from "../scheduledItems/ScheduledItemList.tsx";
import ScheduledItemModal from "../scheduledItems/ScheduledItemModal.tsx";
import { useOwnerFilter } from "../scheduledItems/useOwnerFilter.ts";
import { useScheduledItemListActions } from "../scheduledItems/useScheduledItemListActions.ts";
import { useScheduledItems } from "../scheduledItems/useScheduledItems.ts";

import HomeHeader from "./HomeHeader.tsx";

const NO_ITEMS = 0;

const Home = () => {
  const { items, loading, error } = useScheduledItems();
  const { household } = useHousehold();
  const { session } = useAuth();
  const actions = useScheduledItemListActions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduledItem | null>(null);
  const filter = useOwnerFilter(items, household?.members, session?.user.id ?? null);
  const scrollRef = useScrollRestoration<HTMLElement>();

  const openEditor = (item: ScheduledItem | null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-full min-h-dvh flex-col bg-background">
      <HomeHeader household={household} onAdd={() => openEditor(null)} />

      <main ref={scrollRef} className="flex-1 overflow-y-auto">
        <div
          className="mx-auto w-full max-w-2xl px-4 py-6"
          style={{
            paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
            paddingLeft: "max(1rem, env(safe-area-inset-left))",
            paddingRight: "max(1rem, env(safe-area-inset-right))",
          }}
        >
          <div className="mb-6 flex flex-col gap-5">
            <TodayMigraineLog />
            <TodayPainLog />
          </div>

          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
            What&apos;s coming up
          </h2>

          {!loading && items.length > NO_ITEMS && (
            <OwnerFilterBar
              options={filter.options}
              value={filter.active.key}
              onChange={filter.select}
            />
          )}

          <ScheduledItemList
            items={filter.visibleItems}
            members={household?.members ?? []}
            loading={loading}
            error={error}
            filtered={filter.active.key !== ALL_FILTER_KEY}
            onEdit={openEditor}
            onDelete={actions.onDelete}
            onComplete={actions.onComplete}
            onBump={actions.onBump}
          />
        </div>
      </main>

      <ScheduledItemModal
        isOpen={isModalOpen}
        item={editingItem}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Home;
