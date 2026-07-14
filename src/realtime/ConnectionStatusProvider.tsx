import { createContext, useState, type ReactNode } from "react";

import { useScheduledItemsRealtime } from "../scheduledItems/useScheduledItemsRealtime.ts";

import { pendingConnectionStatus, type ConnectionStatus } from "./connectionStatus.ts";

export const ConnectionStatusContext = createContext<ConnectionStatus | undefined>(undefined);

export const ConnectionStatusProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<ConnectionStatus>(pendingConnectionStatus);

  useScheduledItemsRealtime(setStatus);

  return (
    <ConnectionStatusContext.Provider value={status}>{children}</ConnectionStatusContext.Provider>
  );
};
