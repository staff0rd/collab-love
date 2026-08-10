import ExtraMedicationMark from "./ExtraMedicationMark.tsx";
import PainChart from "./PainChart.tsx";
import type { PainSeries } from "./painSeries.ts";

const NONE = 0;

const PainChartCard = ({ series }: { series: PainSeries }) => (
  <section className="rounded-lg border bg-card p-4 text-card-foreground">
    <header className="mb-2 flex items-center justify-between gap-3">
      <h2 className="text-sm font-semibold">Pain level</h2>
      {series.extraMedicationDays > NONE && (
        <ExtraMedicationMark className="text-xs text-muted-foreground" />
      )}
    </header>
    <PainChart points={series.points} />
  </section>
);

export default PainChartCard;
