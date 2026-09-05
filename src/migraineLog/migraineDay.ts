import type { MigraineEntry } from "./getMigraineLog.ts";

export type MigraineDay = {
  label: string;
  entry: MigraineEntry;
  saveFailed: boolean;
  onChange: (entry: MigraineEntry) => void;
};
