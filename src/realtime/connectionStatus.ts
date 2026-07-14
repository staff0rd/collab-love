export type ConnectionStatus = "connected" | "connecting" | "offline";

export const pendingConnectionStatus = (): ConnectionStatus => {
  if (navigator.onLine) {
    return "connecting";
  }
  return "offline";
};
