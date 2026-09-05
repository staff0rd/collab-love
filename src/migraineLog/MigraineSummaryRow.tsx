import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils.ts";

import type { MigraineEntry } from "./getMigraineLog.ts";
import { migraineSummaryTags } from "./migraineSummaryTags.ts";

const NONE = 0;

const NOTHING_OF_NOTE = "No migraine, no exercise";

const TAG_CLASSES =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium";

const toneClasses = (alarm: boolean) => {
  if (alarm) {
    return "bg-destructive/[0.12] text-destructive";
  }
  return "bg-secondary text-muted-foreground";
};

type MigraineSummaryRowProps = {
  entry: MigraineEntry;
  onCorrect: () => void;
};

const MigraineSummaryRow = ({ entry, onCorrect }: MigraineSummaryRowProps) => {
  const tags = migraineSummaryTags(entry);

  return (
    <button
      type="button"
      onClick={onCorrect}
      aria-label="Edit today's migraine entry"
      className="flex min-h-15 w-full items-center gap-3 border-t px-4 py-2.5 text-left text-[15px] transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
    >
      <span className="font-medium">Today</span>
      {tags.length === NONE && (
        <span className="text-sm text-muted-foreground">{NOTHING_OF_NOTE}</span>
      )}
      <span className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span key={tag.key} className={cn(TAG_CLASSES, toneClasses(tag.alarm))}>
            <tag.icon className="size-3 shrink-0" />
            {tag.label}
          </span>
        ))}
      </span>
      <ChevronRight className="ml-auto size-[18px] shrink-0 text-muted-foreground" />
    </button>
  );
};

export default MigraineSummaryRow;
