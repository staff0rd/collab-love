import MigraineCalendar from "./MigraineCalendar.tsx";
import type { MigraineWeek } from "./migraineWeeks.ts";

const LEGEND = [
  { key: "migraine", label: "Migraine day", swatch: "bg-destructive" },
  { key: "exercise", label: "Exercised", swatch: "bg-primary" },
  { key: "no", label: "No", swatch: "bg-secondary" },
  { key: "unrecorded", label: "Not recorded", swatch: "border border-dashed border-input" },
];

const MigraineCalendarCard = ({ weeks }: { weeks: MigraineWeek[] }) => (
  <section className="rounded-lg border bg-card p-4 text-card-foreground">
    <div className="grid gap-5 sm:grid-cols-2">
      <MigraineCalendar
        title="Migraine"
        subject="migraine"
        yesClass="bg-destructive"
        answer={(entry) => entry.migraine}
        weeks={weeks}
      />
      <MigraineCalendar
        title="Exercise"
        subject="exercise"
        yesClass="bg-primary"
        answer={(entry) => entry.exercised}
        weeks={weeks}
      />
    </div>

    <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
      {LEGEND.map((item) => (
        <span key={item.key} className="inline-flex items-center gap-1.5">
          <span className={`size-2.5 rounded-xs ${item.swatch}`} />
          {item.label}
        </span>
      ))}
    </p>
  </section>
);

export default MigraineCalendarCard;
