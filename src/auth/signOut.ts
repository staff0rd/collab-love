import { supabase } from "../lib/supabaseClient.ts";
import { clearScheduledItemSnapshot } from "../widget/scheduledItemSnapshotStore.ts";

export const signOut = async () => {
  await supabase.auth.signOut();
  await clearScheduledItemSnapshot();
};
