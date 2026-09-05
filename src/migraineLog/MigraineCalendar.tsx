import { Fragment } from "react";

import type { MigraineAnswer, MigraineEntry } from "./getMigraineLog.ts";
import type { MigraineWeek } from "./migraineWeeks.ts";

const CELL_CLASSES = "h-6 rounded-sm sm:h-7";

const COLUMN_HEADS = [
  { key: "mon", label: "M" },
  { key: "tue", label: "T" },
  { key: "wed", label: "W" },
  { key: "thu", label: "T" },
  { key: "fri", label: "F" },
];

type CellState = "future" | "unrecorded" | "yes" | "no";

const cellState = (answer: MigraineAnswer, future: boolean): CellState => {
  if (future) {
    return "future";
  }
  if (answer === null) {
    return "unrecorded";
  }
  if (answer) {
    return "yes";
  }
  return "no";
};

const stateClass = (state: CellState, yesClass: string) => {
  if (state === "yes") {
    return yesClass;
  }
  if (state === "no") {
    return "bg-secondary";
  }
  if (state === "unrecorded") {
    return "border border-dashed border-input";
  }
  return "";
};

const stateLabel = (state: CellState, subject: string) => {
  if (state === "yes") {
    return subject;
  }
  if (state === "no") {
    return `no ${subject}`;
  }
  return "not recorded";
};

type MigraineCalendarProps = {
  title: string;
  subject: string;
  yesClass: string;
  answer: (entry: MigraineEntry) => MigraineAnswer;
  weeks: MigraineWeek[];
};

const MigraineCalendar = ({ title, subject, yesClass, answer, weeks }: MigraineCalendarProps) => (
  <div>
    <h3 className="mb-2 text-sm font-semibold">{title}</h3>
    <div className="grid grid-cols-[3.25rem_repeat(5,minmax(0,1fr))] items-center gap-1">
      <span />
      {COLUMN_HEADS.map((head) => (
        <span
          key={head.key}
          aria-hidden="true"
          className="text-center text-xs font-medium text-muted-foreground"
        >
          {head.label}
        </span>
      ))}

      {weeks.map((week) => (
        <Fragment key={week.key}>
          <span className="text-xs tabular-nums text-muted-foreground">{week.label}</span>
          {week.days.map((day) => {
            const state = cellState(answer(day.entry), day.future);
            if (state === "future") {
              return <span key={day.key} className={CELL_CLASSES} />;
            }
            return (
              <span
                key={day.key}
                role="img"
                aria-label={`${day.label}: ${stateLabel(state, subject)}`}
                className={`${CELL_CLASSES} ${stateClass(state, yesClass)}`}
              />
            );
          })}
        </Fragment>
      ))}
    </div>
  </div>
);

export default MigraineCalendar;
