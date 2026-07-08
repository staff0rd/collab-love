import { IonContent, IonPage, IonRouterOutlet, IonSpinner } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";

import { useAuth } from "./auth/useAuth.ts";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";

const AuthenticatedApp = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-flex ion-justify-content-center ion-align-items-center">
          <IonSpinner />
        </IonContent>
      </IonPage>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

export default AuthenticatedApp;
