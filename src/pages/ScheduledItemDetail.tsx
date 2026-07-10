import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Button } from "@/components/ui/button.tsx";

import { deleteScheduledItem } from "../scheduledItems/deleteScheduledItem.ts";
import { getScheduledItem } from "../scheduledItems/getScheduledItem.ts";
import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";
import ScheduledItemModal from "../scheduledItems/ScheduledItemModal.tsx";

import ScheduledItemDetailContent from "./ScheduledItemDetailContent.tsx";

const ScheduledItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<ScheduledItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const load = useCallback(async () => {
    if (!id) {
      return;
    }
    setLoading(true);
    try {
      setItem(await getScheduledItem(id));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async () => {
    if (!id) {
      return;
    }
    await deleteScheduledItem(id);
    void navigate("/home");
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
            loading={loading}
            onEdit={() => setIsEditOpen(true)}
            onDelete={() => void handleDelete()}
          />
        </div>
      </main>

      {item && (
        <ScheduledItemModal
          isOpen={isEditOpen}
          item={item}
          onClose={() => setIsEditOpen(false)}
          onSaved={load}
        />
      )}
    </div>
  );
};

export default ScheduledItemDetail;
