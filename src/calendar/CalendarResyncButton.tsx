import { Button } from "@/components/ui/button.tsx";

const resyncLabel = (cooldown: number): string => {
  if (cooldown) {
    return `Syncing to your devices… ${cooldown}s`;
  }
  return "Clear duplicates & re-sync";
};

const CalendarResyncButton = ({
  busy,
  cooldown,
  onResync,
}: {
  busy: boolean;
  cooldown: number;
  onResync: () => void;
}) => (
  <div className="flex flex-col gap-1">
    <Button
      type="button"
      variant="outline"
      className="w-full sm:w-auto"
      disabled={busy || Boolean(cooldown)}
      onClick={onResync}
    >
      {resyncLabel(cooldown)}
    </Button>
    <p className="text-sm text-muted-foreground">
      Removes every event this app added to the calendar and recreates one per item. Use this if you
      see duplicated events.
    </p>
  </div>
);

export default CalendarResyncButton;
