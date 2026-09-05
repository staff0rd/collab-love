import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button.tsx";

import type { MigraineEntry } from "./getMigraineLog.ts";
import { isRecorded } from "./migraineEntryStatus.ts";
import MigraineEntryFields from "./MigraineEntryFields.tsx";
import MigraineSummaryRow from "./MigraineSummaryRow.tsx";

const PILL_CLASSES =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium";

const CardStatePill = ({ recorded }: { recorded: boolean }) => {
  if (recorded) {
    return (
      <span className={`${PILL_CLASSES} bg-secondary text-muted-foreground`}>
        <Check className="size-3" />
        Recorded
      </span>
    );
  }
  return <span className={`${PILL_CLASSES} bg-primary/[0.12] text-primary`}>1 to record</span>;
};

type MigraineLogCardProps = {
  dayLabel: string;
  entry: MigraineEntry;
  loading: boolean;
  failed: boolean;
  saveFailed: boolean;
  onChange: (entry: MigraineEntry) => void;
};

const MigraineLogCard = ({
  dayLabel,
  entry,
  loading,
  failed,
  saveFailed,
  onChange,
}: MigraineLogCardProps) => {
  const [correcting, setCorrecting] = useState(false);
  const recorded = isRecorded(entry);
  const ready = !loading && !failed;
  const open = ready && (!recorded || correcting);

  return (
    <section className="overflow-hidden rounded-lg border bg-card text-card-foreground">
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <h2 className="text-base font-semibold">Migraine log</h2>
        {ready && <CardStatePill recorded={recorded} />}
      </div>

      {loading && (
        <div className="flex justify-center px-4 pb-6 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      )}

      {!loading && failed && (
        <p className="px-4 pb-4 text-sm text-muted-foreground">
          Couldn&apos;t load the migraine log.
        </p>
      )}

      {ready && !open && <MigraineSummaryRow entry={entry} onCorrect={() => setCorrecting(true)} />}

      {open && (
        <div className="flex flex-col gap-1 border-t px-4 pb-4 pt-3">
          <div className="flex items-baseline justify-between gap-2">
            <strong className="text-[15px] font-semibold">Today · {dayLabel}</strong>
            {!recorded && <span className="text-xs text-muted-foreground">Not recorded</span>}
            {recorded && (
              <Button
                size="sm"
                variant="ghost"
                className="-mr-2 h-7 px-2 text-xs"
                onClick={() => setCorrecting(false)}
              >
                Done
              </Button>
            )}
          </div>

          <MigraineEntryFields entry={entry} onChange={onChange} />

          {saveFailed && (
            <p role="alert" className="text-sm text-destructive">
              Could not save the entry. Please try again.
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default MigraineLogCard;
