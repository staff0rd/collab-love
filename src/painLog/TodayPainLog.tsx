import { useState } from "react";

import { addDays } from "../lib/dateMath.ts";
import { localDayValue } from "../lib/localDayValue.ts";

import PainLogCard from "./PainLogCard.tsx";
import type { PainLogDay } from "./painReadingDescription.ts";
import PainReadingSheet from "./PainReadingSheet.tsx";
import { painSlots } from "./painSlots.ts";
import { painSlotStates, type PainSlotState } from "./painSlotStates.ts";
import { useCurrentMinute } from "./useCurrentMinute.ts";
import { usePainLog } from "./usePainLog.ts";

const PREVIOUS_DAY = -1;

type OpenSlot = {
  logDate: string;
  day: PainLogDay;
  state: PainSlotState;
};

const isUnrecorded = (state: PainSlotState) => state.status === "pending";

const TodayPainLog = () => {
  const now = useCurrentMinute();
  const yesterday = addDays(now, PREVIOUS_DAY);
  const todayDate = localDayValue(now);
  const yesterdayDate = localDayValue(yesterday);
  const today = usePainLog(todayDate);
  const previous = usePainLog(yesterdayDate);
  const [openSlot, setOpenSlot] = useState<OpenSlot | null>(null);

  return (
    <>
      <PainLogCard
        states={painSlotStates(painSlots(now), today.readings, now)}
        missed={painSlotStates(painSlots(yesterday), previous.readings, now).filter(isUnrecorded)}
        loading={today.loading || previous.loading}
        failed={today.error !== null || previous.error !== null}
        onRecord={(state) => setOpenSlot({ day: "today", logDate: todayDate, state })}
        onRecordMissed={(state) => setOpenSlot({ day: "yesterday", logDate: yesterdayDate, state })}
      />

      {openSlot && (
        <PainReadingSheet
          logDate={openSlot.logDate}
          day={openSlot.day}
          slot={openSlot.state.slot}
          reading={openSlot.state.reading}
          onClose={() => setOpenSlot(null)}
        />
      )}
    </>
  );
};

export default TodayPainLog;
