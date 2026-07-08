import { supabase } from "../lib/supabaseClient.ts";

export type Household = {
  id: string;
  name: string;
  memberIds: string[];
};

type HouseholdRow = {
  id: string;
  name: string;
  household_members: { user_id: string }[];
};

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

  return {
    id: row.id,
    memberIds: row.household_members.map((member) => member.user_id),
    name: row.name,
  };
};
