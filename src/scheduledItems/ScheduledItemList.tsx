import {
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonNote,
  IonSpinner,
  IonText,
  useIonAlert,
} from "@ionic/react";

import type { ScheduledItem } from "./getScheduledItems.ts";

const EMPTY_COUNT = 0;

const formatScheduledAt = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

type ScheduledItemListProps = {
  items: ScheduledItem[];
  loading: boolean;
  onEdit: (item: ScheduledItem) => void;
  onDelete: (item: ScheduledItem) => void;
};

const ScheduledItemList = ({ items, loading, onEdit, onDelete }: ScheduledItemListProps) => {
  const [presentAlert] = useIonAlert();

  if (loading) {
    return (
      <div className="home-status">
        <IonSpinner />
      </div>
    );
  }

  if (items.length === EMPTY_COUNT) {
    return (
      <div className="home-status">
        <h1>What&apos;s coming up</h1>
        <IonText color="medium">
          <p>Nothing scheduled yet. Tap + to add the first item.</p>
        </IonText>
      </div>
    );
  }

  const confirmDelete = (item: ScheduledItem) => {
    void presentAlert({
      buttons: [
        { role: "cancel", text: "Cancel" },
        { handler: () => onDelete(item), role: "destructive", text: "Delete" },
      ],
      header: "Delete item?",
      message: `"${item.title}" will be permanently removed.`,
    });
  };

  return (
    <IonList>
      {items.map((item) => (
        <IonItemSliding key={item.id}>
          <IonItem button detail={false} onClick={() => onEdit(item)}>
            <IonLabel>
              <h2>{item.title}</h2>
              <p>{formatScheduledAt(item.scheduledAt)}</p>
              {item.notes && <p>{item.notes}</p>}
            </IonLabel>
            {item.owner && <IonNote slot="end">{item.owner}</IonNote>}
          </IonItem>
          <IonItemOptions slot="end">
            <IonItemOption onClick={() => onEdit(item)}>Edit</IonItemOption>
            <IonItemOption color="danger" onClick={() => confirmDelete(item)}>
              Delete
            </IonItemOption>
          </IonItemOptions>
        </IonItemSliding>
      ))}
    </IonList>
  );
};

export default ScheduledItemList;
