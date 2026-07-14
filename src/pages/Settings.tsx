import { ArrowLeft, LoaderCircle } from "lucide-react";
import { type FormEvent } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button.tsx";

import CalendarSyncField from "../calendar/CalendarSyncField.tsx";
import MemberNameField from "../profile/MemberNameField.tsx";
import { useMemberNamesForm } from "../profile/useMemberNamesForm.ts";
import { useScheduledItems } from "../scheduledItems/useScheduledItems.ts";

const Settings = () => {
  const navigate = useNavigate();
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
    <div className="flex h-full min-h-dvh flex-col bg-background">
      <header
        className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div
          className="mx-auto flex w-full max-w-2xl items-center gap-2 px-4 py-3"
          style={{
            paddingLeft: "max(1rem, env(safe-area-inset-left))",
            paddingRight: "max(1rem, env(safe-area-inset-right))",
          }}
        >
          <Button
            size="icon"
            variant="ghost"
            aria-label="Back"
            onClick={() => void navigate("/home")}
          >
            <ArrowLeft />
          </Button>
          <h1 className="truncate text-lg font-semibold text-foreground">Settings</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div
          className="mx-auto w-full max-w-2xl px-4 py-6"
          style={{
            paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
            paddingLeft: "max(1rem, env(safe-area-inset-left))",
            paddingRight: "max(1rem, env(safe-area-inset-right))",
          }}
        >
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
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Settings;
