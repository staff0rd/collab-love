import { IonDatetime, IonInput, IonItem, IonLabel, IonList, IonTextarea } from "@ionic/react";

import type { ScheduledItemFormState } from "./useScheduledItemForm.ts";

const ScheduledItemFields = ({ form }: { form: ScheduledItemFormState }) => (
  <IonList>
    <IonItem>
      <IonInput
        label="Title"
        labelPlacement="stacked"
        placeholder="What's happening?"
        value={form.title}
        onIonInput={(event) => form.setTitle(event.detail.value ?? "")}
      />
    </IonItem>
    <IonItem>
      <IonInput
        label="Owner"
        labelPlacement="stacked"
        placeholder="Who's responsible?"
        value={form.owner}
        onIonInput={(event) => form.setOwner(event.detail.value ?? "")}
      />
    </IonItem>
    <IonItem>
      <IonTextarea
        autoGrow
        label="Notes"
        labelPlacement="stacked"
        placeholder="Anything to remember?"
        value={form.notes}
        onIonInput={(event) => form.setNotes(event.detail.value ?? "")}
      />
    </IonItem>
    <IonItem>
      <IonLabel position="stacked">Date &amp; time</IonLabel>
      <IonDatetime
        presentation="date-time"
        value={form.scheduledAt || undefined}
        onIonChange={(event) => {
          const { value } = event.detail;
          if (typeof value === "string") {
            form.setScheduledAt(value);
          }
        }}
      />
    </IonItem>
  </IonList>
);

export default ScheduledItemFields;
