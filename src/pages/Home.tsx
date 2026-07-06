import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";

import "./Home.css";

const Home = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>collab-love</IonTitle>
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
      </div>
    </IonContent>
  </IonPage>
);

export default Home;
