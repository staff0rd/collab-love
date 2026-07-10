import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import type { ScheduledItem } from "./getScheduledItems.ts";
import ScheduledItemFields from "./ScheduledItemFields.tsx";
import { useScheduledItemForm } from "./useScheduledItemForm.ts";

type ScheduledItemModalProps = {
  isOpen: boolean;
  item: ScheduledItem | null;
  onClose: () => void;
  onSaved: () => void;
};

const ScheduledItemModal = ({ isOpen, item, onClose, onSaved }: ScheduledItemModalProps) => {
  const form = useScheduledItemForm(() => {
    onSaved();
    onClose();
  });

  const handleDismiss = () => {
    form.reset();
    onClose();
  };

  const handleWillPresent = () => {
    if (item) {
      form.load(item);
    } else {
      form.reset();
    }
  };

  let heading = "New item";
  if (form.isEditing) {
    heading = "Edit item";
  }

  return (
    <IonModal isOpen={isOpen} onWillPresent={handleWillPresent} onDidDismiss={handleDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleDismiss}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>{heading}</IonTitle>
          <IonButtons slot="end">
            <IonButton strong disabled={!form.canSave} onClick={form.handleSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <ScheduledItemFields form={form} />
        {form.error && (
          <IonText color="danger">
            <p>{form.error}</p>
          </IonText>
        )}
      </IonContent>
    </IonModal>
  );
};

export default ScheduledItemModal;
