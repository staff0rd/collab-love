import { cn } from "@/lib/utils.ts";

import type { ConnectionStatus } from "./connectionStatus.ts";
import { useConnectionStatus } from "./useConnectionStatus.ts";

const STATUS_CONFIG: Record<ConnectionStatus, { label: string; dot: string; pulse: boolean }> = {
  connected: { dot: "bg-emerald-500", label: "Live", pulse: false },
  connecting: { dot: "bg-amber-500", label: "Connecting", pulse: true },
  offline: { dot: "bg-muted-foreground", label: "Offline", pulse: false },
};

const ConnectionStatusIndicator = () => {
  const status = useConnectionStatus();
  const { dot, label, pulse } = STATUS_CONFIG[status];

  return (
    <div
      className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground"
      role="status"
      aria-live="polite"
      aria-label={`Sync status: ${label}`}
    >
      <span className={cn("size-2 rounded-full", dot, pulse && "animate-pulse")} />
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
};

export default ConnectionStatusIndicator;
