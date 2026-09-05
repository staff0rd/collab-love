import { useState } from "react";

import OverviewStates from "../components/OverviewStates.tsx";
import RangeToggle from "../components/RangeToggle.tsx";

import PainChartCard from "./PainChartCard.tsx";
import PainRangeSummary from "./PainRangeSummary.tsx";
import { PAIN_RANGES } from "./painRanges.ts";
import { painSeries } from "./painSeries.ts";
import { usePainLogRange } from "./usePainLogRange.ts";

const DEFAULT_RANGE = 0;
const NO_READINGS = 0;

const PainOverview = () => {
  const [range, setRange] = useState(PAIN_RANGES[DEFAULT_RANGE]);
  const today = new Date();
  const { days, loading, error, refreshing } = usePainLogRange(range, today);
  const series = painSeries(days, range, today);

  return (
    <div className="flex flex-col gap-4">
      <RangeToggle
        ariaLabel="Chart range"
        options={PAIN_RANGES}
        value={range.key}
        onChange={setRange}
      />

      <OverviewStates
        loading={loading}
        error={error}
        empty={series.readingCount === NO_READINGS}
        refreshing={refreshing}
        errorTitle="Couldn't load pain readings"
        emptyTitle="No readings yet"
        emptyDescription={`Nothing was recorded in the last ${range.label.toLowerCase()}. Check-ins recorded on Home show up here.`}
      >
        <PainRangeSummary series={series} />
        <PainChartCard series={series} />
      </OverviewStates>
    </div>
  );
};

export default PainOverview;
