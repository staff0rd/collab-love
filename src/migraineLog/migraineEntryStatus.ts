import type { MigraineEntry } from "./getMigraineLog.ts";

export const isRecorded = (entry: MigraineEntry) =>
  entry.exercised !== null && entry.migraine !== null;
