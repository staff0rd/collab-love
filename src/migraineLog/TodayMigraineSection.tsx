import { useState } from "react";

import type { MigraineDay } from "./migraineDay.ts";
import MigraineEntryBlock from "./MigraineEntryBlock.tsx";
import { isRecorded } from "./migraineEntryStatus.ts";
import MigraineSummaryRow from "./MigraineSummaryRow.tsx";

const TodayMigraineSection = ({ day }: { day: MigraineDay }) => {
  const [correcting, setCorrecting] = useState(false);

  if (isRecorded(day.entry) && !correcting) {
    return <MigraineSummaryRow entry={day.entry} onCorrect={() => setCorrecting(true)} />;
  }

  return (
    <MigraineEntryBlock
      title={`Today · ${day.label}`}
      entry={day.entry}
      saveFailed={day.saveFailed}
      onDone={() => setCorrecting(false)}
      onChange={day.onChange}
    />
  );
};

export default TodayMigraineSection;
