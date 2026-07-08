import { supabase } from "../lib/supabaseClient.ts";

export const signInWithAppleWeb = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    options: { redirectTo: window.location.origin },
    provider: "apple",
  });
  if (error) {
    throw error;
  }
};
