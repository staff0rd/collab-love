import { useState } from "react";

import { Button } from "@/components/ui/button.tsx";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet.tsx";

import type { PainReading } from "./getPainLog.ts";
import PainReadingFields from "./PainReadingFields.tsx";
import type { PainSlot } from "./painSlots.ts";
import { useSavePainReading } from "./useSavePainReading.ts";

const description = (reading: PainReading | null) => {
  if (reading) {
    return "Recorded earlier today";
  }
  return "Today's check-in";
};

const saveLabel = (saving: boolean) => {
  if (saving) {
    return "Saving…";
  }
  return "Save";
};

type PainReadingSheetProps = {
  logDate: string;
  slot: PainSlot;
  reading: PainReading | null;
  onClose: () => void;
};

const PainReadingSheet = ({ logDate, slot, reading, onClose }: PainReadingSheetProps) => {
  const [level, setLevel] = useState<number | null>(reading?.level ?? null);
  const [extraMedication, setExtraMedication] = useState(reading?.extraMedication ?? false);
  const save = useSavePainReading(logDate, onClose);

  const handleSave = () => {
    if (level !== null) {
      save.mutate({ reading: { extraMedication, level }, slot: slot.key });
    }
  };

  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{slot.label}</SheetTitle>
          <SheetDescription>{description(reading)}</SheetDescription>
        </SheetHeader>

        <SheetBody className="flex flex-col gap-5">
          <PainReadingFields
            slot={slot}
            level={level}
            extraMedication={extraMedication}
            onLevelChange={setLevel}
            onExtraMedicationChange={setExtraMedication}
          />

          {save.isError && (
            <p role="alert" className="text-sm text-destructive">
              Could not save the reading. Please try again.
            </p>
          )}
        </SheetBody>

        <SheetFooter>
          {reading && (
            <Button
              variant="ghost"
              className="mr-auto px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={save.isPending}
              onClick={() => save.mutate({ reading: null, slot: slot.key })}
            >
              Clear
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={level === null || save.isPending} onClick={handleSave}>
            {saveLabel(save.isPending)}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default PainReadingSheet;
