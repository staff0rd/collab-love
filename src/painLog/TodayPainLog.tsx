import { useState } from "react";

import { localDayValue } from "../lib/localDayValue.ts";

import PainLogCard from "./PainLogCard.tsx";
import PainReadingSheet from "./PainReadingSheet.tsx";
import { painSlots, type PainSlotKey } from "./painSlots.ts";
import { painSlotStates } from "./painSlotStates.ts";
import { useCurrentMinute } from "./useCurrentMinute.ts";
import { usePainLog } from "./usePainLog.ts";

const TodayPainLog = () => {
  const now = useCurrentMinute();
  const logDate = localDayValue(now);
  const { readings, loading, error } = usePainLog(logDate);
  const [openSlotKey, setOpenSlotKey] = useState<PainSlotKey | null>(null);

  const slots = painSlots(now);
  const states = painSlotStates(slots, readings, now);
  const openSlot = slots.find((slot) => slot.key === openSlotKey) ?? null;

  return (
    <>
      <PainLogCard
        states={states}
        loading={loading}
        failed={error !== null}
        onRecord={(slot) => setOpenSlotKey(slot.key)}
      />

      {openSlot && (
        <PainReadingSheet
          logDate={logDate}
          slot={openSlot}
          reading={readings[openSlot.key]}
          onClose={() => setOpenSlotKey(null)}
        />
      )}
    </>
  );
};

export default TodayPainLog;
