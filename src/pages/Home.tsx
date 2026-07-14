import { useState } from "react";

import { useAuth } from "../auth/useAuth.ts";
import { useHousehold } from "../household/useHousehold.ts";
import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";
import { ALL_FILTER_KEY } from "../scheduledItems/ownerFilterOptions.ts";
import OwnerFilterBar from "../scheduledItems/OwnerFilterBar.tsx";
import ScheduledItemList from "../scheduledItems/ScheduledItemList.tsx";
import ScheduledItemModal from "../scheduledItems/ScheduledItemModal.tsx";
import { useCompleteScheduledItem } from "../scheduledItems/useCompleteScheduledItem.ts";
import { useDeleteScheduledItem } from "../scheduledItems/useDeleteScheduledItem.ts";
import { useOwnerFilter } from "../scheduledItems/useOwnerFilter.ts";
import { useScheduledItems } from "../scheduledItems/useScheduledItems.ts";

import HomeHeader from "./HomeHeader.tsx";

const NO_ITEMS = 0;

const Home = () => {
  const { items, loading } = useScheduledItems();
  const { household } = useHousehold();
  const { session } = useAuth();
  const deleteMutation = useDeleteScheduledItem();
  const completeMutation = useCompleteScheduledItem();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduledItem | null>(null);
  const filter = useOwnerFilter(items, household?.members, session?.user.id ?? null);

  const openEditor = (item: ScheduledItem | null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-full min-h-dvh flex-col bg-background">
      <HomeHeader household={household} onAdd={() => openEditor(null)} />

      <main className="flex-1 overflow-y-auto">
        <div
          className="mx-auto w-full max-w-2xl px-4 py-6"
          style={{
            paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
            paddingLeft: "max(1rem, env(safe-area-inset-left))",
            paddingRight: "max(1rem, env(safe-area-inset-right))",
          }}
        >
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
            filtered={filter.active.key !== ALL_FILTER_KEY}
            onEdit={openEditor}
            onDelete={(item) => deleteMutation.mutate(item.id)}
            onComplete={(item) => completeMutation.mutate(item)}
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
