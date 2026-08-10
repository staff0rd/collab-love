import type { PainSeries } from "./painSeries.ts";

const SINGULAR = 1;
const NO_LEVEL = "—";

const dayCountLabel = (days: number) => {
  if (days === SINGULAR) {
    return "1 day";
  }
  return `${days} days`;
};

const averageLabel = (averageLevel: number | null) => {
  if (averageLevel === null) {
    return NO_LEVEL;
  }
  return String(averageLevel);
};

const StatTile = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border bg-card px-4 py-3 text-card-foreground">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-0.5 text-2xl font-semibold">{value}</p>
  </div>
);

const PainRangeSummary = ({ series }: { series: PainSeries }) => (
  <div className="grid grid-cols-2 gap-3">
    <StatTile label="Average pain" value={averageLabel(series.averageLevel)} />
    <StatTile label="Extra medication" value={dayCountLabel(series.extraMedicationDays)} />
  </div>
);

export default PainRangeSummary;
