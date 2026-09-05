import { useState } from "react";

import OverviewStates from "../components/OverviewStates.tsx";
import RangeToggle from "../components/RangeToggle.tsx";

import MigraineCalendarCard from "./MigraineCalendarCard.tsx";
import MigraineExerciseInsight from "./MigraineExerciseInsight.tsx";
import MigraineMedicationSplit from "./MigraineMedicationSplit.tsx";
import { MIGRAINE_RANGES } from "./migraineRanges.ts";
import MigraineRangeSummary from "./MigraineRangeSummary.tsx";
import { migraineSummary } from "./migraineSummary.ts";
import { migraineWeeks } from "./migraineWeeks.ts";
import { useMigraineLogRange } from "./useMigraineLogRange.ts";

const DEFAULT_RANGE = 0;
const NO_ENTRIES = 0;

const MigraineOverview = () => {
  const [range, setRange] = useState(MIGRAINE_RANGES[DEFAULT_RANGE]);
  const today = new Date();
  const { days, loading, error, refreshing } = useMigraineLogRange(range, today);
  const weeks = migraineWeeks(days, range, today);
  const summary = migraineSummary(weeks);

  return (
    <div className="flex flex-col gap-4">
      <RangeToggle
        ariaLabel="History range"
        options={MIGRAINE_RANGES}
        value={range.key}
        onChange={setRange}
      />

      <OverviewStates
        loading={loading}
        error={error}
        empty={summary.recordedDays === NO_ENTRIES}
        refreshing={refreshing}
        errorTitle="Couldn't load the migraine log"
        emptyTitle="No entries yet"
        emptyDescription={`Nothing was recorded in the last ${range.label}. Weekdays recorded on Home show up here.`}
      >
        <MigraineRangeSummary summary={summary} />
        <MigraineExerciseInsight summary={summary} />
        <MigraineCalendarCard weeks={weeks} />
        <MigraineMedicationSplit summary={summary} />
      </OverviewStates>
    </div>
  );
};

export default MigraineOverview;
