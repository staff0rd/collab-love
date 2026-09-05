import { Button } from "@/components/ui/button.tsx";

import type { MigraineDay } from "./migraineDay.ts";
import MigraineEntryBlock from "./MigraineEntryBlock.tsx";

type MissedMigraineSectionProps = {
  day: MigraineDay;
  open: boolean;
  onOpen: () => void;
  onDone: () => void;
};

const MissedMigraineSection = ({ day, open, onOpen, onDone }: MissedMigraineSectionProps) => (
  <section className="border-t">
    <h3 className="bg-secondary/60 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      Missed {day.label}
    </h3>

    {!open && (
      <div className="flex min-h-15 items-center gap-3 border-t bg-primary/[0.06] px-4 py-2.5 text-[15px]">
        <span className="font-medium">{day.label}</span>
        <Button
          size="sm"
          className="ml-auto"
          onClick={onOpen}
          aria-label={`Record ${day.label}'s migraine entry`}
        >
          Record
        </Button>
      </div>
    )}

    {open && (
      <MigraineEntryBlock
        title={day.label}
        entry={day.entry}
        saveFailed={day.saveFailed}
        onDone={onDone}
        onChange={day.onChange}
      />
    )}
  </section>
);

export default MissedMigraineSection;
