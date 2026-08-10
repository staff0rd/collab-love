import { createContext, useState, type ReactNode } from "react";

import { useHouseholdRealtime } from "./useHouseholdRealtime";

import { pendingConnectionStatus, type ConnectionStatus } from "./connectionStatus.ts";

export const ConnectionStatusContext = createContext<ConnectionStatus | undefined>(undefined);

export const ConnectionStatusProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<ConnectionStatus>(pendingConnectionStatus);

  useHouseholdRealtime(setStatus);

  return (
    <ConnectionStatusContext.Provider value={status}>{children}</ConnectionStatusContext.Provider>
  );
};
