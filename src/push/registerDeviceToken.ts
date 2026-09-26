import { supabase } from "../lib/supabaseClient.ts";

const IOS_PLATFORM = "ios";

let registeredToken: string | null = null;

export const registerDeviceToken = async (userId: string, token: string): Promise<void> => {
  const { error } = await supabase
    .from("device_tokens")
    .upsert({ platform: IOS_PLATFORM, token, user_id: userId }, { onConflict: "user_id,token" });
  if (error) {
    throw error;
  }
  registeredToken = token;
};

export const unregisterDeviceToken = async (): Promise<void> => {
  if (registeredToken === null) {
    return;
  }
  const { error } = await supabase.from("device_tokens").delete().eq("token", registeredToken);
  if (error) {
    throw error;
  }
  registeredToken = null;
};
