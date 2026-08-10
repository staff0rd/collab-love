import { useId } from "react";

import { Switch } from "@/components/ui/switch.tsx";

import PainLevelGrid from "./PainLevelGrid.tsx";
import type { PainSlot } from "./painSlots.ts";

type PainReadingFieldsProps = {
  slot: PainSlot;
  level: number | null;
  extraMedication: boolean;
  onLevelChange: (level: number) => void;
  onExtraMedicationChange: (extraMedication: boolean) => void;
};

const PainReadingFields = ({
  slot,
  level,
  extraMedication,
  onLevelChange,
  onExtraMedicationChange,
}: PainReadingFieldsProps) => {
  const levelLabelId = useId();
  const medicationLabelId = useId();

  return (
    <>
      <div>
        <span id={levelLabelId} className="mb-2.5 block text-sm font-medium">
          Pain level
        </span>
        <PainLevelGrid value={level} labelledBy={levelLabelId} onChange={onLevelChange} />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>0 — none</span>
          <span>10 — worst</span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-4 border-t pt-5">
        <div>
          <span id={medicationLabelId} className="text-sm font-medium">
            Extra medication
          </span>
          <p className="mt-1 max-w-[40ch] text-[13px] text-muted-foreground">
            Non-regular pain medication taken {slot.medicationSince}.
          </p>
        </div>
        <Switch
          checked={extraMedication}
          onCheckedChange={onExtraMedicationChange}
          aria-labelledby={medicationLabelId}
        />
      </div>
    </>
  );
};

export default PainReadingFields;
