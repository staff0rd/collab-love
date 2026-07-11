import { type Household, memberDisplayName } from "./getHousehold.ts";

const NO_MEMBERS = 0;

const HouseholdSummary = ({ household }: { household: Household | null }) => (
  <div className="min-w-0">
    <h1 className="truncate text-lg font-semibold text-foreground">
      {household?.name ?? "collab-love"}
    </h1>
    {household && household.members.length > NO_MEMBERS && (
      <p className="truncate text-sm text-muted-foreground">
        {household.members.map(memberDisplayName).join(" & ")}
      </p>
    )}
  </div>
);

export default HouseholdSummary;
