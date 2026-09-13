import DataStates from "../components/DataStates.tsx";
import { memberDisplayName, type HouseholdMember } from "../household/getHousehold.ts";

import ActivityFeedRow from "./ActivityFeedRow.tsx";
import type { ActivityEntry } from "./partnerActivity.ts";

const EMPTY_COUNT = 0;

const partnerLabel = (partner: HouseholdMember | null): string => {
  if (partner) {
    return memberDisplayName(partner);
  }
  return "They";
};

type ActivityFeedProps = {
  entries: ActivityEntry[];
  partner: HouseholdMember | null;
  loading: boolean;
  error?: unknown;
};

const ActivityFeed = ({ entries, partner, loading, error }: ActivityFeedProps) => {
  const partnerName = partnerLabel(partner);

  return (
    <DataStates
      loading={loading}
      error={error}
      empty={entries.length === EMPTY_COUNT}
      errorTitle="Couldn't load activity"
      emptyTitle="Nothing new"
      emptyDescription="Additions and changes from the other person will show up here."
    >
      <ul className="flex flex-col gap-2">
        {entries.map((entry) => (
          <ActivityFeedRow key={entry.key} entry={entry} partnerName={partnerName} />
        ))}
      </ul>
    </DataStates>
  );
};

export default ActivityFeed;
