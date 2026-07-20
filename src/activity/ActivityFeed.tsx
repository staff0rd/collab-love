import { AlertTriangle, Loader2 } from "lucide-react";

import { memberDisplayName, type HouseholdMember } from "../household/getHousehold.ts";

import ActivityFeedRow from "./ActivityFeedRow.tsx";
import type { ActivityEntry } from "./partnerActivity.ts";

const EMPTY_COUNT = 0;

const errorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Something went wrong.";
};

const ErrorState = ({ error }: { error: unknown }) => (
  <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed border-destructive/40 bg-destructive/5 py-16 text-center">
    <AlertTriangle className="mb-1 size-6 text-destructive" />
    <p className="font-medium">Couldn&apos;t load activity</p>
    <p className="max-w-xs text-sm text-muted-foreground">{errorMessage(error)}</p>
  </div>
);

const partnerLabel = (partner: HouseholdMember | null): string => {
  if (partner) {
    return memberDisplayName(partner);
  }
  return "They";
};

const EmptyState = () => (
  <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed py-16 text-center">
    <p className="font-medium">Nothing new</p>
    <p className="text-sm text-muted-foreground">
      Additions and changes from the other person will show up here.
    </p>
  </div>
);

type ActivityFeedProps = {
  entries: ActivityEntry[];
  partner: HouseholdMember | null;
  loading: boolean;
  error?: unknown;
};

const ActivityFeed = ({ entries, partner, loading, error }: ActivityFeedProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-16 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (entries.length === EMPTY_COUNT) {
    return <EmptyState />;
  }

  const partnerName = partnerLabel(partner);

  return (
    <ul className="flex flex-col gap-2">
      {entries.map((entry) => (
        <ActivityFeedRow key={entry.key} entry={entry} partnerName={partnerName} />
      ))}
    </ul>
  );
};

export default ActivityFeed;
