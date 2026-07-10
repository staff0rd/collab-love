import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button.tsx";

import SignOutButton from "../auth/SignOutButton.tsx";
import { useHousehold } from "../household/useHousehold.ts";
import { deleteScheduledItem } from "../scheduledItems/deleteScheduledItem.ts";
import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";
import ScheduledItemList from "../scheduledItems/ScheduledItemList.tsx";
import ScheduledItemModal from "../scheduledItems/ScheduledItemModal.tsx";
import { useScheduledItems } from "../scheduledItems/useScheduledItems.ts";

const Home = () => {
  const { items, loading, refresh } = useScheduledItems();
  const { household } = useHousehold();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduledItem | null>(null);

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
            <Button size="sm" onClick={openAdd}>
              <Plus />
              Add item
            </Button>
            <SignOutButton />
          </div>
        </div>
      </header>

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

          <ScheduledItemList
            items={items}
            loading={loading}
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
