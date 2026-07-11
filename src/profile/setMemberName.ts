import { supabase } from "../lib/supabaseClient.ts";

type SetMemberNameArgs = {
  householdId: string;
  viewerUserId: string;
  subjectUserId: string;
  displayName: string;
};

export const setMemberName = async ({
  householdId,
  viewerUserId,
  subjectUserId,
  displayName,
}: SetMemberNameArgs): Promise<void> => {
  const trimmed = displayName.trim();

  if (trimmed === "") {
    const { error } = await supabase
      .from("member_names")
      .delete()
      .eq("subject_user_id", subjectUserId);
    if (error) {
      throw error;
    }
    return;
  }

  const { error } = await supabase.from("member_names").upsert(
    {
      display_name: trimmed,
      household_id: householdId,
      subject_user_id: subjectUserId,
      viewer_user_id: viewerUserId,
    },
    { onConflict: "viewer_user_id,subject_user_id" },
  );
  if (error) {
    throw error;
  }
};
