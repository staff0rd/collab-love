import { Check, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button.tsx";

import type { BumpScope } from "./bumpScheduledItem.ts";
import type { ScheduledItem } from "./getScheduledItems.ts";
import ScheduledItemBumpMenu from "./ScheduledItemBumpMenu.tsx";
import type { SnoozeTarget } from "./snoozeTarget.ts";

type ScheduledItemActionsMenuProps = {
  item: ScheduledItem;
  showComplete: boolean;
  showBump: boolean;
  onEdit: (item: ScheduledItem) => void;
  onComplete: (item: ScheduledItem) => void;
  onBump: (item: ScheduledItem, target: SnoozeTarget, scope: BumpScope) => void;
  onDeleteRequest: () => void;
  onClose: () => void;
};

const ScheduledItemActionsMenu = ({
  item,
  showComplete,
  showBump,
  onEdit,
  onComplete,
  onBump,
  onDeleteRequest,
  onClose,
}: ScheduledItemActionsMenuProps) => {
  const [bumpTarget, setBumpTarget] = useState<SnoozeTarget | null>(null);

  const bumpMenu = showBump && (
    <ScheduledItemBumpMenu
      item={item}
      target={bumpTarget}
      onTargetChange={setBumpTarget}
      onBump={(target, scope) => {
        onClose();
        onBump(item, target, scope);
      }}
    />
  );

  if (bumpTarget) {
    return <>{bumpMenu}</>;
  }

  return (
    <>
      {showComplete && (
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            onClose();
            onComplete(item);
          }}
        >
          <Check />
          Mark done
        </Button>
      )}
      {bumpMenu}
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => {
          onClose();
          onEdit(item);
        }}
      >
        <Pencil />
        Edit
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start text-destructive hover:text-destructive"
        onClick={() => {
          onClose();
          onDeleteRequest();
        }}
      >
        <Trash2 />
        Delete
      </Button>
    </>
  );
};

export default ScheduledItemActionsMenu;
