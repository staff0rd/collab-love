import { supabase } from "../lib/supabaseClient.ts";
import { unregisterDeviceToken } from "../push/registerDeviceToken.ts";
import { clearScheduledItemSnapshot } from "../widget/scheduledItemSnapshotStore.ts";

export const signOut = async () => {
  await unregisterDeviceToken().catch((cause) => {
    console.error("Failed to remove the device push token", cause);
  });
  await supabase.auth.signOut();
  await clearScheduledItemSnapshot();
};
