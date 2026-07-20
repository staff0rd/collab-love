import { Pencil, Plus } from "lucide-react";
import { Link } from "react-router";

import { relativeDayLabel } from "../scheduledItems/relativeDayLabel.ts";

import type { ActivityEntry } from "./partnerActivity.ts";

const kindLabel: Record<ActivityEntry["kind"], string> = {
  added: "Added",
  changed: "Changed",
};

const sourceLabel: Record<ActivityEntry["source"], string> = {
  featureRequest: "Feature request",
  scheduledItem: "Scheduled item",
};

const kindIcon: Record<ActivityEntry["kind"], typeof Plus> = {
  added: Plus,
  changed: Pencil,
};

const entryLink = (entry: ActivityEntry): string => {
  if (entry.source === "scheduledItem") {
    return `/items/${entry.itemId}`;
  }
  return "/requests";
};

type ActivityFeedRowProps = {
  entry: ActivityEntry;
  partnerName: string;
};

const ActivityFeedRow = ({ entry, partnerName }: ActivityFeedRowProps) => {
  const Icon = kindIcon[entry.kind];

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
            {partnerName} {kindLabel[entry.kind].toLowerCase()} this{" "}
            {sourceLabel[entry.source].toLowerCase()}
          </p>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {relativeDayLabel(new Date(entry.at), new Date())}
        </span>
      </Link>
    </li>
  );
};

export default ActivityFeedRow;
