import ExtraMedicationMark from "./ExtraMedicationMark.tsx";
import type { PainPoint } from "./painSeries.ts";

const PainTooltipBody = ({ point }: { point: PainPoint }) => {
  if (point.level === null) {
    return <span className="text-muted-foreground">No reading</span>;
  }

  return (
    <span className="flex flex-1 flex-col gap-1">
      <span className="flex items-center justify-between gap-4">
        <span className="text-muted-foreground">Pain level</span>
        <span className="font-medium tabular-nums">{point.level}</span>
      </span>
      {point.extraMedication && <ExtraMedicationMark />}
    </span>
  );
};

export default PainTooltipBody;
