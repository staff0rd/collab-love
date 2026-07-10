import {
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { add } from "ionicons/icons";
import { useState } from "react";

import SignOutButton from "../auth/SignOutButton.tsx";
import { useHousehold } from "../household/useHousehold.ts";
import { deleteScheduledItem } from "../scheduledItems/deleteScheduledItem.ts";
import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";
import ScheduledItemList from "../scheduledItems/ScheduledItemList.tsx";
import ScheduledItemModal from "../scheduledItems/ScheduledItemModal.tsx";
import { useScheduledItems } from "../scheduledItems/useScheduledItems.ts";

import "./Home.css";

const Home = () => {
  const { items, loading, refresh } = useScheduledItems();
  const { household } = useHousehold();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduledItem | null>(null);

  const openAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: ScheduledItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: ScheduledItem) => {
    await deleteScheduledItem(item.id);
    await refresh();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{household?.name ?? "collab-love"}</IonTitle>
          <IonButtons slot="end">
            <SignOutButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">What&apos;s coming up</IonTitle>
          </IonToolbar>
        </IonHeader>

        <ScheduledItemList
          items={items}
          loading={loading}
          onEdit={openEdit}
          onDelete={(item) => void handleDelete(item)}
        />

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={openAdd}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <ScheduledItemModal
          isOpen={isModalOpen}
          item={editingItem}
          onClose={() => setIsModalOpen(false)}
          onSaved={refresh}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
