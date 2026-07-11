<<<<<<< Updated upstream
=======
import { Lightbulb, Plus } from "lucide-react";
>>>>>>> Stashed changes
import { useState } from "react";
import { Link } from "react-router";

import { useAuth } from "../auth/useAuth.ts";
import { useHousehold } from "../household/useHousehold.ts";
import { deleteScheduledItem } from "../scheduledItems/deleteScheduledItem.ts";
import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";
import { ALL_FILTER_KEY } from "../scheduledItems/ownerFilterOptions.ts";
import OwnerFilterBar from "../scheduledItems/OwnerFilterBar.tsx";
import ScheduledItemList from "../scheduledItems/ScheduledItemList.tsx";
import ScheduledItemModal from "../scheduledItems/ScheduledItemModal.tsx";
import { useOwnerFilter } from "../scheduledItems/useOwnerFilter.ts";
import { useScheduledItems } from "../scheduledItems/useScheduledItems.ts";

import HomeHeader from "./HomeHeader.tsx";

const NO_ITEMS = 0;

const Home = () => {
  const { items, loading, refresh } = useScheduledItems();
  const { household } = useHousehold();
  const { session } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduledItem | null>(null);
  const filter = useOwnerFilter(items, household?.members, session?.user.id ?? null);

  const openAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: ScheduledItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: ScheduledItem) => {
    await deleteScheduledItem(item.id);
    await refresh();
  };

  return (
    <div className="flex h-full min-h-dvh flex-col bg-background">
<<<<<<< Updated upstream
      <HomeHeader household={household} onAdd={openAdd} />
=======
      <header
        className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div
          className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-4 py-3"
          style={{
            paddingLeft: "max(1rem, env(safe-area-inset-left))",
            paddingRight: "max(1rem, env(safe-area-inset-right))",
          }}
        >
          <h1 className="truncate text-lg font-semibold text-foreground">
            {household?.name ?? "collab-love"}
          </h1>
          <div className="flex items-center gap-1">
            <Button asChild size="icon" variant="ghost" aria-label="Feature requests">
              <Link to="/requests">
                <Lightbulb />
              </Link>
            </Button>
            <Button size="sm" onClick={openAdd}>
              <Plus />
              Add item
            </Button>
            <SignOutButton />
          </div>
        </div>
      </header>
>>>>>>> Stashed changes

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
            onEdit={openEdit}
            onDelete={(item) => void handleDelete(item)}
          />
        </div>
      </main>

      <ScheduledItemModal
        isOpen={isModalOpen}
        item={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSaved={refresh}
      />
    </div>
  );
};

export default Home;
