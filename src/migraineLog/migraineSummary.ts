import type { MigraineEntry } from "./getMigraineLog.ts";
import type { MigraineWeek } from "./migraineWeeks.ts";

const NONE = 0;
const PERCENT = 100;

export type MigraineRate = {
  days: number;
  migraineDays: number;
};

type MedicationSplit = {
  aspirinOnly: number;
  codeineOnly: number;
  both: number;
};

export type MigraineSummary = {
  weekdays: number;
  recordedDays: number;
  migraineDays: number;
  exerciseDays: number;
  medicatedDays: number;
  medication: MedicationSplit;
  exercised: MigraineRate;
  notExercised: MigraineRate;
};

const isMedicated = (entry: MigraineEntry) => entry.tookAspirin || entry.tookCodeine;

const hasAnswer = (entry: MigraineEntry) =>
  entry.exercised !== null || entry.migraine !== null || isMedicated(entry);

const rateFor = (entries: MigraineEntry[], exercised: boolean): MigraineRate => {
  const matching = entries.filter((entry) => entry.exercised === exercised);
  return {
    days: matching.length,
    migraineDays: matching.filter((entry) => entry.migraine === true).length,
  };
};

const medicationSplit = (entries: MigraineEntry[]): MedicationSplit => ({
  aspirinOnly: entries.filter((entry) => entry.tookAspirin && !entry.tookCodeine).length,
  both: entries.filter((entry) => entry.tookAspirin && entry.tookCodeine).length,
  codeineOnly: entries.filter((entry) => entry.tookCodeine && !entry.tookAspirin).length,
});

export const migraineRatePercent = ({ days, migraineDays }: MigraineRate): number | null => {
  if (days === NONE) {
    return null;
  }
  return Math.round((migraineDays / days) * PERCENT);
};

export const migraineSummary = (weeks: MigraineWeek[]): MigraineSummary => {
  const past = weeks.flatMap((week) => week.days).filter((day) => !day.future);
  const entries = past.map((day) => day.entry);

  return {
    exerciseDays: entries.filter((entry) => entry.exercised === true).length,
    exercised: rateFor(entries, true),
    medicatedDays: entries.filter(isMedicated).length,
    medication: medicationSplit(entries),
    migraineDays: entries.filter((entry) => entry.migraine === true).length,
    notExercised: rateFor(entries, false),
    recordedDays: entries.filter(hasAnswer).length,
    weekdays: past.length,
  };
};
