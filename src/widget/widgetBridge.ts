import { registerPlugin } from "@capacitor/core";

export type WidgetBridgePlugin = {
  setSnapshot: (options: { value: string }) => Promise<void>;
};

export const WidgetBridge = registerPlugin<WidgetBridgePlugin>("WidgetBridge");
