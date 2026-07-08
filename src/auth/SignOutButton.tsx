import { IonButton } from "@ionic/react";

import { supabase } from "../lib/supabaseClient.ts";

const signOut = async () => {
  await supabase.auth.signOut();
};

const SignOutButton = () => <IonButton onClick={signOut}>Sign out</IonButton>;

export default SignOutButton;
