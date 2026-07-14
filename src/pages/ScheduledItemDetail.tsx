import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Button } from "@/components/ui/button.tsx";

import { useHousehold } from "../household/useHousehold.ts";
import ScheduledItemModal from "../scheduledItems/ScheduledItemModal.tsx";
import { scheduledItemQueryKey, useScheduledItem } from "../scheduledItems/useScheduledItem.ts";
import { useScheduledItemDetailActions } from "../scheduledItems/useScheduledItemDetailActions.ts";
import { scheduledItemsQueryKey } from "../scheduledItems/useScheduledItems.ts";

import ScheduledItemDetailContent from "./ScheduledItemDetailContent.tsx";

const ScheduledItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { household } = useHousehold();
  const { item, loading } = useScheduledItem(id);
  const { onDelete, onComplete } = useScheduledItemDetailActions(item);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleSaved = () => {
    if (id) {
      void queryClient.invalidateQueries({ queryKey: scheduledItemQueryKey(id) });
    }
    void queryClient.invalidateQueries({ queryKey: scheduledItemsQueryKey });
  };

  return (
    <div className="flex h-full min-h-dvh flex-col bg-background">
      <header
        className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div
          className="mx-auto flex w-full max-w-2xl items-center gap-2 px-4 py-3"
          style={{
            paddingLeft: "max(1rem, env(safe-area-inset-left))",
            paddingRight: "max(1rem, env(safe-area-inset-right))",
          }}
        >
          <Button
            size="icon"
            variant="ghost"
            aria-label="Back"
            onClick={() => void navigate("/home")}
          >
            <ArrowLeft />
          </Button>
          <h1 className="truncate text-lg font-semibold text-foreground">Item</h1>
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
          <ScheduledItemDetailContent
            item={item}
            members={household?.members ?? []}
            loading={loading}
            onEdit={() => setIsEditOpen(true)}
            onDelete={onDelete}
            onComplete={onComplete}
          />
        </div>
      </main>

      {item && (
        <ScheduledItemModal
          isOpen={isEditOpen}
          item={item}
          onClose={() => setIsEditOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default ScheduledItemDetail;
