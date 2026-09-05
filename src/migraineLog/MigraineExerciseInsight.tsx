import { dayCountLabel } from "../lib/dayCountLabel.ts";

import { migraineRatePercent, type MigraineRate, type MigraineSummary } from "./migraineSummary.ts";

const NONE = 0;
const NO_RATE = "—";

const rateLabel = (rate: MigraineRate) => {
  const percent = migraineRatePercent(rate);
  if (percent === null) {
    return NO_RATE;
  }
  return `${percent}%`;
};

const daysLabel = (rate: MigraineRate, verb: string) => {
  if (rate.days === NONE) {
    return "none recorded";
  }
  return `of the ${dayCountLabel(rate.days)} you ${verb}`;
};

const Compare = ({ rate, verb }: { rate: MigraineRate; verb: string }) => (
  <p className="flex items-baseline gap-2 text-sm text-muted-foreground">
    <span className="text-xl font-semibold tabular-nums text-foreground">{rateLabel(rate)}</span>
    {daysLabel(rate, verb)}
  </p>
);

const MigraineExerciseInsight = ({ summary }: { summary: MigraineSummary }) => (
  <section className="rounded-lg border bg-card p-4 text-card-foreground">
    <h2 className="text-sm font-semibold">Migraines on exercise days vs the rest</h2>
    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
      <Compare rate={summary.exercised} verb="exercised" />
      <Compare rate={summary.notExercised} verb="didn't" />
    </div>
  </section>
);

export default MigraineExerciseInsight;
