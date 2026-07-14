import { useContext } from "react";

import { ConnectionStatusContext } from "./ConnectionStatusProvider.tsx";

export const useConnectionStatus = () => {
  const context = useContext(ConnectionStatusContext);
  if (context === undefined) {
    throw new Error("useConnectionStatus must be used within a ConnectionStatusProvider");
  }
  return context;
};
