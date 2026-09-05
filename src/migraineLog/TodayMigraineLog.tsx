import { localDayValue } from "../lib/localDayValue.ts";
import { useCurrentMinute } from "../lib/useCurrentMinute.ts";

import MigraineLogCard from "./MigraineLogCard.tsx";
import { useMigraineLog } from "./useMigraineLog.ts";
import { useSaveMigraineEntry } from "./useSaveMigraineEntry.ts";
import { isWeekday, weekdayName } from "./weekdays.ts";

const TodayMigraineLog = () => {
  const now = useCurrentMinute();
  const todayDate = localDayValue(now);
  const { entry, error, loading } = useMigraineLog(todayDate);
  const { save, failed } = useSaveMigraineEntry(todayDate);

  if (!isWeekday(now)) {
    return null;
  }

  return (
    <MigraineLogCard
      dayLabel={weekdayName(now)}
      entry={entry}
      loading={loading}
      failed={error !== null}
      saveFailed={failed}
      onChange={save}
    />
  );
};

export default TodayMigraineLog;
