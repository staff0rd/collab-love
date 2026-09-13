import { LoaderCircle } from "lucide-react";
import { type FormEvent } from "react";

import { Button } from "@/components/ui/button.tsx";

import CalendarSyncField from "../calendar/CalendarSyncField.tsx";
import MigraineCardField from "../migraineLog/MigraineCardField.tsx";
import PainReminderField from "../painReminders/PainReminderField.tsx";
import MemberNameField from "../profile/MemberNameField.tsx";
import { useMemberNamesForm } from "../profile/useMemberNamesForm.ts";
import { useScheduledItems } from "../scheduledItems/useScheduledItems.ts";

import SubPage from "./SubPage.tsx";

const Settings = () => {
  const { loading, members, names, save, saved, saving, setName, viewerUserId } =
    useMemberNamesForm();
  const { items, loading: itemsLoading } = useScheduledItems();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void save();
  };

  let saveLabel = "Save";
  if (saving) {
    saveLabel = "Saving…";
  }

  return (
    <SubPage title="Settings">
      {loading && (
        <div className="flex justify-center py-10">
          <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <p className="text-sm text-muted-foreground">
            Choose what to call each other. Only you can see these names.
          </p>

          {members.map((member) => (
            <MemberNameField
              key={member.userId}
              id={`name-${member.userId}`}
              isSelf={member.userId === viewerUserId}
              value={names[member.userId] ?? ""}
              onChange={(value) => setName(member.userId, value)}
            />
          ))}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saveLabel}
            </Button>
            {saved && <span className="text-sm text-muted-foreground">Saved</span>}
          </div>

          <CalendarSyncField items={items} loading={itemsLoading} />

          <MigraineCardField />

          <PainReminderField />
        </form>
      )}
    </SubPage>
  );
};

export default Settings;
