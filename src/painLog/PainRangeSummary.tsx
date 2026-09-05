import StatTile from "../components/StatTile.tsx";
import { dayCountLabel } from "../lib/dayCountLabel.ts";

import type { PainSeries } from "./painSeries.ts";

const NO_LEVEL = "—";

const averageLabel = (averageLevel: number | null) => {
  if (averageLevel === null) {
    return NO_LEVEL;
  }
  return String(averageLevel);
};

const PainRangeSummary = ({ series }: { series: PainSeries }) => (
  <div className="grid grid-cols-2 gap-3">
    <StatTile label="Average pain" value={averageLabel(series.averageLevel)} />
    <StatTile label="Extra medication" value={dayCountLabel(series.extraMedicationDays)} />
  </div>
);

export default PainRangeSummary;
