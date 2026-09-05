import { Footprints, Pill, Zap, type LucideIcon } from "lucide-react";

import type { MigraineEntry } from "./getMigraineLog.ts";

type MigraineSummaryTag = {
  key: string;
  label: string;
  icon: LucideIcon;
  alarm: boolean;
};

export const migraineSummaryTags = (entry: MigraineEntry): MigraineSummaryTag[] => {
  const tags: MigraineSummaryTag[] = [];
  if (entry.migraine === true) {
    tags.push({ alarm: true, icon: Zap, key: "migraine", label: "Migraine" });
  }
  if (entry.exercised === true) {
    tags.push({ alarm: false, icon: Footprints, key: "exercise", label: "Exercise" });
  }
  if (entry.tookAspirin) {
    tags.push({ alarm: false, icon: Pill, key: "aspirin", label: "Aspirin" });
  }
  if (entry.tookCodeine) {
    tags.push({ alarm: false, icon: Pill, key: "codeine", label: "Codeine" });
  }
  return tags;
};
