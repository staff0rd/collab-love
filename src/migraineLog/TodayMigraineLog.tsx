import { localDayValue } from "../lib/localDayValue.ts";
import { useCurrentMinute } from "../lib/useCurrentMinute.ts";

import type { MigraineDay } from "./migraineDay.ts";
import MigraineLogCard from "./MigraineLogCard.tsx";
import { useMigraineLog } from "./useMigraineLog.ts";
import { useSaveMigraineEntry } from "./useSaveMigraineEntry.ts";
import { isWeekday, previousWeekday, weekdayName } from "./weekdays.ts";

const useMigraineDay = (date: Date) => {
  const logDate = localDayValue(date);
  const { entry, error, loading } = useMigraineLog(logDate);
  const { save, failed } = useSaveMigraineEntry(logDate);
  const day: MigraineDay = { entry, label: weekdayName(date), onChange: save, saveFailed: failed };

  return { day, failed: error !== null, loading };
};

const weekdayOnly = (weekday: boolean, day: MigraineDay) => {
  if (weekday) {
    return day;
  }
  return null;
};

const TodayMigraineLog = () => {
  const now = useCurrentMinute();
  const today = useMigraineDay(now);
  const missed = useMigraineDay(previousWeekday(now));
  const weekday = isWeekday(now);
  const loading = today.loading || missed.loading;
  const failed = today.failed || missed.failed;

  if (!weekday && (loading || failed)) {
    return null;
  }

  return (
    <MigraineLogCard
      today={weekdayOnly(weekday, today.day)}
      missed={missed.day}
      loading={loading}
      failed={failed}
    />
  );
};

export default TodayMigraineLog;
