import { supabase } from "../lib/supabaseClient.ts";

import { getMemberNames } from "./getMemberNames.ts";

export type HouseholdMember = {
  userId: string;
  displayName: string | null;
};

export type Household = {
  id: string;
  name: string;
  members: HouseholdMember[];
};

type HouseholdRow = {
  id: string;
  name: string;
  household_members: { user_id: string }[];
};

export const memberDisplayName = (member: HouseholdMember): string =>
  member.displayName?.trim() || "Unnamed";

export const getHousehold = async (): Promise<Household | null> => {
  const { data, error } = await supabase
    .from("households")
    .select("id, name, household_members(user_id)")
    .maybeSingle();
  if (error) {
    throw error;
  }

  const row = data as HouseholdRow | null;
  if (!row) {
    return null;
  }

  const names = await getMemberNames();

  return {
    id: row.id,
    members: row.household_members
      .map((member) => ({ displayName: names[member.user_id] ?? null, userId: member.user_id }))
      .sort((left, right) => left.userId.localeCompare(right.userId)),
    name: row.name,
  };
};
