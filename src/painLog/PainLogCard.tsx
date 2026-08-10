import { Check, Loader2 } from "lucide-react";

import type { PainSlot } from "./painSlots.ts";
import type { PainSlotState } from "./painSlotStates.ts";
import PainSlotRow from "./PainSlotRow.tsx";

const NONE = 0;

const PILL_CLASSES =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium";

const countOf = (states: PainSlotState[], status: PainSlotState["status"]) =>
  states.filter((state) => state.status === status).length;

const CardStatePill = ({ states }: { states: PainSlotState[] }) => {
  const pending = countOf(states, "pending");
  if (pending > NONE) {
    return (
      <span className={`${PILL_CLASSES} bg-primary/[0.12] text-primary`}>{pending} to record</span>
    );
  }
  if (countOf(states, "entered") === states.length) {
    return (
      <span className={`${PILL_CLASSES} bg-secondary text-muted-foreground`}>
        <Check className="size-3" />
        All recorded
      </span>
    );
  }
  return null;
};

type PainLogCardProps = {
  states: PainSlotState[];
  loading: boolean;
  failed: boolean;
  onRecord: (slot: PainSlot) => void;
};

const PainLogCard = ({ states, loading, failed, onRecord }: PainLogCardProps) => (
  <section className="overflow-hidden rounded-lg border bg-card text-card-foreground">
    <div className="flex items-center justify-between gap-3 px-4 py-3.5">
      <h2 className="text-base font-semibold">Pain log</h2>
      {!loading && !failed && <CardStatePill states={states} />}
    </div>

    {loading && (
      <div className="flex justify-center px-4 pb-6 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )}

    {!loading && failed && (
      <p className="px-4 pb-4 text-sm text-muted-foreground">
        Couldn&apos;t load today&apos;s pain log.
      </p>
    )}

    {!loading && !failed && (
      <ul>
        {states.map((state) => (
          <li key={state.slot.key} className="border-t first:border-t-0">
            <PainSlotRow state={state} onRecord={() => onRecord(state.slot)} />
          </li>
        ))}
      </ul>
    )}
  </section>
);

export default PainLogCard;
