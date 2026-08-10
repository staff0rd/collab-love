export type PainSlotKey = "morning" | "midday" | "evening";

type PainSlotTime = {
  key: PainSlotKey;
  hour: number;
  minute: number;
};

export type PainSlot = {
  key: PainSlotKey;
  label: string;
  dueAt: Date;
  medicationSince: string;
};

const FIRST_SLOT_INDEX = 0;
const PREVIOUS_SLOT = 1;

const SLOT_TIMES: PainSlotTime[] = [
  { hour: 8, key: "morning", minute: 0 },
  { hour: 12, key: "midday", minute: 30 },
  { hour: 20, key: "evening", minute: 0 },
];

const slotDueAt = (day: Date, slot: PainSlotTime) =>
  new Date(day.getFullYear(), day.getMonth(), day.getDate(), slot.hour, slot.minute);

const slotLabel = (day: Date, slot: PainSlotTime) =>
  slotDueAt(day, slot).toLocaleTimeString(undefined, { timeStyle: "short" });

const medicationSince = (day: Date, index: number) => {
  if (index === FIRST_SLOT_INDEX) {
    return "since waking";
  }
  return `since the ${slotLabel(day, SLOT_TIMES[index - PREVIOUS_SLOT])} reading`;
};

export const painSlots = (day: Date): PainSlot[] =>
  SLOT_TIMES.map((slot, index) => ({
    dueAt: slotDueAt(day, slot),
    key: slot.key,
    label: slotLabel(day, slot),
    medicationSince: medicationSince(day, index),
  }));
