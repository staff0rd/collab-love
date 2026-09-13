import { registerPlugin } from "@capacitor/core";

export type WidgetBridgePlugin = {
  setSnapshot: (options: { value: string }) => Promise<void>;
  clearSnapshot: () => Promise<void>;
  reload: () => Promise<void>;
};

export const WidgetBridge = registerPlugin<WidgetBridgePlugin>("WidgetBridge");
