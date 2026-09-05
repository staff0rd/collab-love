import type { PainReadings } from "../painLog/getPainLog.ts";
import { painSlots, type PainSlotKey } from "../painLog/painSlots.ts";

export type PainReminder = {
  at: Date;
  id: number;
  label: string;
};

const REMINDER_DELAY_HOURS = 2;
const HOUR_MS = 3_600_000;

const REMINDER_IDS: Record<PainSlotKey, number> = { evening: 3, midday: 2, morning: 1 };

export const PAIN_REMINDER_IDS = Object.values(REMINDER_IDS);

export const painReminderSchedule = (now: Date, readings: PainReadings): PainReminder[] =>
  painSlots(now)
    .filter((slot) => readings[slot.key] === null)
    .map((slot) => ({
      at: new Date(slot.dueAt.getTime() + REMINDER_DELAY_HOURS * HOUR_MS),
      id: REMINDER_IDS[slot.key],
      label: slot.label,
    }))
    .filter((reminder) => reminder.at.getTime() > now.getTime());
