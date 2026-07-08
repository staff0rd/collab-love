import { IonButton, IonContent, IonIcon, IonPage, IonText } from "@ionic/react";
import { logoApple } from "ionicons/icons";
import { useState } from "react";

import { signInWithApple } from "../auth/signInWithApple.ts";

import "./Login.css";

const Login = () => {
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setError(null);
    try {
      await signInWithApple();
    } catch {
      setError("Sign in failed. Please try again.");
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="login-screen">
          <div className="login-intro">
            <h1>collab-love</h1>
            <IonText color="medium">
              <p>Sign in to see what&apos;s coming up.</p>
            </IonText>
          </div>
          <IonButton expand="block" onClick={handleSignIn}>
            <IonIcon slot="start" icon={logoApple} />
            Sign in with Apple
          </IonButton>
          {error && (
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
