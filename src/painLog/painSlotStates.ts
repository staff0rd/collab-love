import type { PainReading, PainReadings } from "./getPainLog.ts";
import type { PainSlot } from "./painSlots.ts";

type PainSlotStatus = "entered" | "pending" | "upcoming";

export type PainSlotState = {
  slot: PainSlot;
  status: PainSlotStatus;
  reading: PainReading | null;
};

const FIRST_SLOT_INDEX = 0;
const PREVIOUS_SLOT = 1;

type SlotContext = {
  slots: PainSlot[];
  readings: PainReadings;
  now: Date;
};

const isEnterable = ({ slots, readings, now }: SlotContext, index: number) => {
  const timeHasPassed = now.getTime() >= slots[index].dueAt.getTime();
  const previousRecorded =
    index === FIRST_SLOT_INDEX || readings[slots[index - PREVIOUS_SLOT].key] !== null;

  return timeHasPassed || previousRecorded;
};

export const painSlotStates = (
  slots: PainSlot[],
  readings: PainReadings,
  now: Date,
): PainSlotState[] =>
  slots.map((slot, index) => {
    const reading = readings[slot.key];
    if (reading) {
      return { reading, slot, status: "entered" };
    }
    if (isEnterable({ now, readings, slots }, index)) {
      return { reading: null, slot, status: "pending" };
    }
    return { reading: null, slot, status: "upcoming" };
  });
