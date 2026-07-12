import { supabase } from "../lib/supabaseClient.ts";

export const signOut = async () => {
  await supabase.auth.signOut();
};
