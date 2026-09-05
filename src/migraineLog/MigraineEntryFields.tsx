import { Footprints, Zap } from "lucide-react";

import type { MigraineEntry } from "./getMigraineLog.ts";
import MedicationField from "./MedicationField.tsx";
import YesNoField from "./YesNoField.tsx";

type MigraineEntryFieldsProps = {
  entry: MigraineEntry;
  onChange: (entry: MigraineEntry) => void;
};

const MigraineEntryFields = ({ entry, onChange }: MigraineEntryFieldsProps) => (
  <>
    <YesNoField
      icon={Footprints}
      label="Exercise"
      hint={null}
      value={entry.exercised}
      yesTone="default"
      onChange={(exercised) => onChange({ ...entry, exercised })}
    />
    <YesNoField
      icon={Zap}
      label="Migraine"
      hint="Stopped you working"
      value={entry.migraine}
      yesTone="alarm"
      onChange={(migraine) => onChange({ ...entry, migraine })}
    />
    <MedicationField
      entry={entry}
      onChange={(medication, taken) => onChange({ ...entry, [medication]: taken })}
    />
  </>
);

export default MigraineEntryFields;
