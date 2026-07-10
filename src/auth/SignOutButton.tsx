import { Button } from "@/components/ui/button.tsx";

import { supabase } from "../lib/supabaseClient.ts";

const signOut = async () => {
  await supabase.auth.signOut();
};

const SignOutButton = () => (
  <Button variant="ghost" onClick={() => void signOut()}>
    Sign out
  </Button>
);

export default SignOutButton;
