import StatTile from "../components/StatTile.tsx";

import type { MigraineSummary } from "./migraineSummary.ts";

const MigraineRangeSummary = ({ summary }: { summary: MigraineSummary }) => (
  <div className="grid gap-3 sm:grid-cols-3">
    <StatTile
      label="Migraine days"
      value={String(summary.migraineDays)}
      suffix={`of ${summary.weekdays} weekdays`}
    />
    <StatTile
      label="Exercise days"
      value={String(summary.exerciseDays)}
      suffix={`of ${summary.weekdays}`}
    />
    <StatTile
      label="Days medicated"
      value={String(summary.medicatedDays)}
      suffix={`of ${summary.weekdays}`}
    />
  </div>
);

export default MigraineRangeSummary;
