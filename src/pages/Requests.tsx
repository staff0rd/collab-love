import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button.tsx";

import FeatureRequestList from "../featureRequests/FeatureRequestList.tsx";
import FeatureRequestModal from "../featureRequests/FeatureRequestModal.tsx";
import type { FeatureRequest } from "../featureRequests/getFeatureRequests.ts";
import { useAdvanceFeatureRequestStatus } from "../featureRequests/useAdvanceFeatureRequestStatus.ts";
import { useDeleteFeatureRequest } from "../featureRequests/useDeleteFeatureRequest.ts";
import { useFeatureRequests } from "../featureRequests/useFeatureRequests.ts";

const Requests = () => {
  const { items, loading } = useFeatureRequests();
  const advanceStatusMutation = useAdvanceFeatureRequestStatus();
  const deleteMutation = useDeleteFeatureRequest();
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
            onAdvanceStatus={(item) => advanceStatusMutation.mutate(item)}
            onDelete={(item) => deleteMutation.mutate(item.id)}
          />
        </div>
      </main>

      <FeatureRequestModal
        isOpen={isModalOpen}
        item={editingItem}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Requests;
