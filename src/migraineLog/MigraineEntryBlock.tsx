import { Button } from "@/components/ui/button.tsx";

import type { MigraineEntry } from "./getMigraineLog.ts";
import MigraineEntryFields from "./MigraineEntryFields.tsx";
import { isRecorded } from "./migraineEntryStatus.ts";

type MigraineEntryBlockProps = {
  title: string;
  entry: MigraineEntry;
  saveFailed: boolean;
  onDone: () => void;
  onChange: (entry: MigraineEntry) => void;
};

const MigraineEntryBlock = ({
  title,
  entry,
  saveFailed,
  onDone,
  onChange,
}: MigraineEntryBlockProps) => (
  <div className="flex flex-col gap-1 border-t px-4 pb-4 pt-3">
    <div className="flex items-baseline justify-between gap-2">
      <strong className="text-[15px] font-semibold">{title}</strong>
      {!isRecorded(entry) && <span className="text-xs text-muted-foreground">Not recorded</span>}
      {isRecorded(entry) && (
        <Button size="sm" variant="ghost" className="-mr-2 h-7 px-2 text-xs" onClick={onDone}>
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
);

export default MigraineEntryBlock;
