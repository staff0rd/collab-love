import { Loader2 } from "lucide-react";

import FeatureRequestRow from "./FeatureRequestRow.tsx";
import type { FeatureRequest } from "./getFeatureRequests.ts";

const EMPTY_COUNT = 0;

type FeatureRequestListProps = {
  items: FeatureRequest[];
  loading: boolean;
  onEdit: (item: FeatureRequest) => void;
  onAdvanceStatus: (item: FeatureRequest) => void;
  onDelete: (item: FeatureRequest) => void;
};

const FeatureRequestList = ({
  items,
  loading,
  onEdit,
  onAdvanceStatus,
  onDelete,
}: FeatureRequestListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-16 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (items.length === EMPTY_COUNT) {
    return (
      <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed py-16 text-center">
        <p className="font-medium">No requests yet</p>
        <p className="text-sm text-muted-foreground">Add your first idea to get started.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <FeatureRequestRow
          key={item.id}
          item={item}
          onEdit={onEdit}
          onAdvanceStatus={onAdvanceStatus}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default FeatureRequestList;
