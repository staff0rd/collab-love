import { supabase } from "../lib/supabaseClient.ts";

const IOS_PLATFORM = "ios";

export const registerDeviceToken = async (userId: string, token: string): Promise<void> => {
  const { error } = await supabase
    .from("device_tokens")
    .upsert({ platform: IOS_PLATFORM, token, user_id: userId }, { onConflict: "user_id,token" });
  if (error) {
    throw error;
  }
};
