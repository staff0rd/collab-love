import { dayCountLabel } from "../lib/dayCountLabel.ts";

import type { MigraineSummary } from "./migraineSummary.ts";

const NONE = 0;
const PERCENT = 100;

type MedicationSegment = {
  key: string;
  label: string;
  swatch: string;
  days: number;
};

const segmentsOf = ({ medication }: MigraineSummary): MedicationSegment[] => [
  { days: medication.aspirinOnly, key: "aspirin", label: "Aspirin only", swatch: "bg-primary" },
  { days: medication.codeineOnly, key: "codeine", label: "Codeine only", swatch: "bg-primary/50" },
  { days: medication.both, key: "both", label: "Both", swatch: "bg-destructive" },
];

const segmentWidth = (days: number, total: number) => `${(days / total) * PERCENT}%`;

const barLabel = (segments: MedicationSegment[]) =>
  segments.map((segment) => `${segment.label} ${segment.days}`).join(", ");

const MigraineMedicationSplit = ({ summary }: { summary: MigraineSummary }) => {
  const segments = segmentsOf(summary);
  const total = summary.medicatedDays;

  return (
    <section className="rounded-lg border bg-card p-4 text-card-foreground">
      <h2 className="text-sm font-semibold">Medication, {dayCountLabel(total)}</h2>

      {total === NONE && (
        <p className="mt-2 text-sm text-muted-foreground">No medication recorded in this range.</p>
      )}

      {total > NONE && (
        <>
          <div
            role="img"
            aria-label={barLabel(segments)}
            className="my-2.5 flex h-3 overflow-hidden rounded-full bg-secondary"
          >
            {segments.map((segment) => (
              <span
                key={segment.key}
                className={segment.swatch}
                style={{ width: segmentWidth(segment.days, total) }}
              />
            ))}
          </div>

          <p className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            {segments.map((segment) => (
              <span key={segment.key} className="inline-flex items-center gap-1.5">
                <span className={`size-2.5 rounded-xs ${segment.swatch}`} />
                {segment.label} · {segment.days}
              </span>
            ))}
          </p>
        </>
      )}
    </section>
  );
};

export default MigraineMedicationSplit;
