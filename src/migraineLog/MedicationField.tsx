import { Pill } from "lucide-react";

import { cn } from "@/lib/utils.ts";

import type { MigraineEntry } from "./getMigraineLog.ts";
import MigraineField from "./MigraineField.tsx";

const CHIP_CLASSES =
  "h-9 rounded-full border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

type Medication = {
  key: "tookAspirin" | "tookCodeine";
  label: string;
};

const MEDICATIONS: Medication[] = [
  { key: "tookAspirin", label: "Aspirin" },
  { key: "tookCodeine", label: "Codeine" },
];

const chipClasses = (selected: boolean) => {
  if (selected) {
    return "border-foreground bg-secondary font-medium";
  }
  return "border-input hover:bg-accent";
};

type MedicationFieldProps = {
  entry: MigraineEntry;
  onChange: (medication: Medication["key"], taken: boolean) => void;
};

const MedicationField = ({ entry, onChange }: MedicationFieldProps) => (
  <MigraineField icon={Pill} label="Medication" hint="Optional">
    <span role="group" aria-label="Medication taken" className="flex shrink-0 gap-1.5">
      {MEDICATIONS.map((medication) => {
        const selected = entry[medication.key];
        return (
          <button
            key={medication.key}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(medication.key, !selected)}
            className={cn(CHIP_CLASSES, chipClasses(selected))}
          >
            {medication.label}
          </button>
        );
      })}
    </span>
  </MigraineField>
);

export default MedicationField;
