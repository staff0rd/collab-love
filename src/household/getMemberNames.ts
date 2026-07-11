import { supabase } from "../lib/supabaseClient.ts";

type MemberNameRow = {
  subject_user_id: string;
  display_name: string;
};

export const getMemberNames = async (): Promise<Record<string, string>> => {
  const { data, error } = await supabase
    .from("member_names")
    .select("subject_user_id, display_name");
  if (error) {
    throw error;
  }

  const names: Record<string, string> = {};
  for (const row of data as MemberNameRow[]) {
    names[row.subject_user_id] = row.display_name;
  }
  return names;
};
