import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button.tsx";

import { deleteFeatureRequest } from "../featureRequests/deleteFeatureRequest.ts";
import { NEXT_FEATURE_REQUEST_STATUS } from "../featureRequests/featureRequestStatus.ts";
import FeatureRequestList from "../featureRequests/FeatureRequestList.tsx";
import FeatureRequestModal from "../featureRequests/FeatureRequestModal.tsx";
import type { FeatureRequest } from "../featureRequests/getFeatureRequests.ts";
import { updateFeatureRequest } from "../featureRequests/updateFeatureRequest.ts";
import { useFeatureRequests } from "../featureRequests/useFeatureRequests.ts";

const Requests = () => {
  const { items, loading, refresh } = useFeatureRequests();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FeatureRequest | null>(null);

  const openAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: FeatureRequest) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAdvanceStatus = async (item: FeatureRequest) => {
    const next = NEXT_FEATURE_REQUEST_STATUS[item.status];
    if (!next) {
      return;
    }
    await updateFeatureRequest(item.id, { status: next });
    await refresh();
  };

  const handleDelete = async (item: FeatureRequest) => {
    await deleteFeatureRequest(item.id);
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
          <div className="flex min-w-0 items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              aria-label="Back"
              onClick={() => void navigate("/home")}
            >
              <ArrowLeft />
            </Button>
            <h1 className="truncate text-lg font-semibold text-foreground">Feature requests</h1>
          </div>
          <Button size="sm" onClick={openAdd}>
            <Plus />
            Add request
          </Button>
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
          <FeatureRequestList
            items={items}
            loading={loading}
            onEdit={openEdit}
            onAdvanceStatus={(item) => void handleAdvanceStatus(item)}
            onDelete={(item) => void handleDelete(item)}
          />
        </div>
      </main>

      <FeatureRequestModal
        isOpen={isModalOpen}
        item={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSaved={refresh}
      />
    </div>
  );
};

export default Requests;
