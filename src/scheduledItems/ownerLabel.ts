import { type HouseholdMember, memberDisplayName } from "../household/getHousehold.ts";

export const ownerLabel = (ownerUserId: string | null, members: HouseholdMember[]): string => {
  if (ownerUserId === null) {
    return "Both";
  }
  const member = members.find((candidate) => candidate.userId === ownerUserId);
  if (!member) {
    return "Unnamed";
  }
  return memberDisplayName(member);
};
