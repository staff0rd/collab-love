import { useState } from "react";

import PainChartCard from "./PainChartCard.tsx";
import PainOverviewStates from "./PainOverviewStates.tsx";
import PainRangeSummary from "./PainRangeSummary.tsx";
import PainRangeToggle from "./PainRangeToggle.tsx";
import { PAIN_RANGES } from "./painRanges.ts";
import { painSeries } from "./painSeries.ts";
import { usePainLogRange } from "./usePainLogRange.ts";

const DEFAULT_RANGE = 0;
const REFRESHING_OPACITY = 0.6;
const SETTLED_OPACITY = 1;

const bodyOpacity = (refreshing: boolean) => {
  if (refreshing) {
    return REFRESHING_OPACITY;
  }
  return SETTLED_OPACITY;
};

const PainOverview = () => {
  const [range, setRange] = useState(PAIN_RANGES[DEFAULT_RANGE]);
  const today = new Date();
  const { days, loading, error, refreshing } = usePainLogRange(range, today);
  const series = painSeries(days, range, today);

  return (
    <div className="flex flex-col gap-4">
      <PainRangeToggle value={range.key} onChange={setRange} />

      <PainOverviewStates series={series} rangeLabel={range.label} loading={loading} error={error}>
        <div
          className="flex flex-col gap-3 transition-opacity"
          style={{ opacity: bodyOpacity(refreshing) }}
        >
          <PainRangeSummary series={series} />
          <PainChartCard series={series} />
        </div>
      </PainOverviewStates>
    </div>
  );
};

export default PainOverview;
