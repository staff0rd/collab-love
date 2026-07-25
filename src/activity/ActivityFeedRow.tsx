import { CalendarClock, Pencil, Plus } from "lucide-react";
import { Link } from "react-router";

import { relativeDayLabel } from "../scheduledItems/relativeDayLabel.ts";

import type { ActivityEntry } from "./partnerActivity.ts";

const kindVerb: Record<ActivityEntry["kind"], string> = {
  added: "added",
  bumped: "bumped",
  changed: "changed",
};

const sourceLabel: Record<ActivityEntry["source"], string> = {
  featureRequest: "feature request",
  scheduledItem: "scheduled item",
};

const kindIcon: Record<ActivityEntry["kind"], typeof Plus> = {
  added: Plus,
  bumped: CalendarClock,
  changed: Pencil,
};

const entryLink = (entry: ActivityEntry): string => {
  if (entry.source === "scheduledItem") {
    return `/items/${entry.itemId}`;
  }
  return "/requests";
};

const bumpSuffix = (entry: ActivityEntry, now: Date): string => {
  if (entry.kind !== "bumped" || entry.occurrenceAt === null) {
    return "";
  }
  return `, now due ${relativeDayLabel(new Date(entry.occurrenceAt), now).toLowerCase()}`;
};

const entryDescription = (entry: ActivityEntry, partnerName: string, now: Date): string =>
  `${partnerName} ${kindVerb[entry.kind]} this ${sourceLabel[entry.source]}${bumpSuffix(entry, now)}`;

type ActivityFeedRowProps = {
  entry: ActivityEntry;
  partnerName: string;
};

const ActivityFeedRow = ({ entry, partnerName }: ActivityFeedRowProps) => {
  const Icon = kindIcon[entry.kind];
  const now = new Date();

  return (
    <li>
      <Link
        to={entryLink(entry)}
        className="flex items-start gap-3 rounded-lg border bg-card p-4 text-card-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <Icon className="size-4" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="truncate font-medium">{entry.title}</h3>
          <p className="text-sm text-muted-foreground">
            {entryDescription(entry, partnerName, now)}
          </p>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {relativeDayLabel(new Date(entry.at), now)}
        </span>
      </Link>
    </li>
  );
};

export default ActivityFeedRow;
