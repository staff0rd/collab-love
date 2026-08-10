import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button.tsx";

import FeatureRequestList from "../featureRequests/FeatureRequestList.tsx";
import FeatureRequestModal from "../featureRequests/FeatureRequestModal.tsx";
import type { FeatureRequest } from "../featureRequests/getFeatureRequests.ts";
import { useAdvanceFeatureRequestStatus } from "../featureRequests/useAdvanceFeatureRequestStatus.ts";
import { useDeleteFeatureRequest } from "../featureRequests/useDeleteFeatureRequest.ts";
import { useFeatureRequests } from "../featureRequests/useFeatureRequests.ts";

import SubPage from "./SubPage.tsx";

const Requests = () => {
  const { items, loading, error } = useFeatureRequests();
  const advanceStatusMutation = useAdvanceFeatureRequestStatus();
  const deleteMutation = useDeleteFeatureRequest();
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
    <SubPage
      title="Feature requests"
      actions={
        <Button size="sm" onClick={openAdd}>
          <Plus />
          Add request
        </Button>
      }
    >
      <FeatureRequestList
        items={items}
        loading={loading}
        error={error}
        onEdit={openEdit}
        onAdvanceStatus={(item) => advanceStatusMutation.mutate(item)}
        onDelete={(item) => deleteMutation.mutate(item.id)}
      />

      <FeatureRequestModal
        isOpen={isModalOpen}
        item={editingItem}
        onClose={() => setIsModalOpen(false)}
      />
    </SubPage>
  );
};

export default Requests;
