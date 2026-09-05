import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

import type { MigraineDay } from "./migraineDay.ts";
import { isRecorded } from "./migraineEntryStatus.ts";
import MissedMigraineSection from "./MissedMigraineSection.tsx";
import TodayMigraineSection from "./TodayMigraineSection.tsx";

const NONE = 0;

const PILL_CLASSES =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium";

const outstandingCount = (days: (MigraineDay | null)[]) =>
  days.filter((day) => day !== null && !isRecorded(day.entry)).length;

const CardStatePill = ({ outstanding }: { outstanding: number }) => {
  if (outstanding > NONE) {
    return (
      <span className={`${PILL_CLASSES} bg-primary/[0.12] text-primary`}>
        {outstanding} to record
      </span>
    );
  }
  return (
    <span className={`${PILL_CLASSES} bg-secondary text-muted-foreground`}>
      <Check className="size-3" />
      Recorded
    </span>
  );
};

type MigraineLogCardProps = {
  today: MigraineDay | null;
  missed: MigraineDay;
  loading: boolean;
  failed: boolean;
};

const MigraineLogCard = ({ today, missed, loading, failed }: MigraineLogCardProps) => {
  const [missedOpen, setMissedOpen] = useState(false);
  const ready = !loading && !failed;
  const showMissed = !isRecorded(missed.entry) || missedOpen;

  if (ready && today === null && !showMissed) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-lg border bg-card text-card-foreground">
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <h2 className="text-base font-semibold">Migraine log</h2>
        {ready && <CardStatePill outstanding={outstandingCount([today, missed])} />}
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

      {ready && today !== null && <TodayMigraineSection day={today} />}

      {ready && showMissed && (
        <MissedMigraineSection
          day={missed}
          open={missedOpen}
          onOpen={() => setMissedOpen(true)}
          onDone={() => setMissedOpen(false)}
        />
      )}
    </section>
  );
};

export default MigraineLogCard;
