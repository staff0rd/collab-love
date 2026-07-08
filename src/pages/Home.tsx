import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import SignOutButton from "../auth/SignOutButton.tsx";
import { useHousehold } from "../household/useHousehold.ts";

import "./Home.css";

const SINGLE_MEMBER = 1;

const memberLabel = (count: number) => {
  if (count === SINGLE_MEMBER) {
    return "member";
  }
  return "members";
};

const Home = () => {
  const { household } = useHousehold();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>collab-love</IonTitle>
          <IonButtons slot="end">
            <SignOutButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">collab-love</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="home-placeholder">
          <h1>What&apos;s coming up</h1>
          <p>Your shared schedule will live here.</p>
          {household && (
            <IonText color="medium">
              <p>
                {household.name} · {household.memberIds.length}{" "}
                {memberLabel(household.memberIds.length)}
              </p>
            </IonText>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
