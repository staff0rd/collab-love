import { registerPlugin, type PluginListenerHandle } from "@capacitor/core";

export type SilentPushPlugin = {
  handled: () => Promise<void>;
  addListener: (eventName: "silentPush", listener: () => void) => Promise<PluginListenerHandle>;
};

export const SilentPush = registerPlugin<SilentPushPlugin>("SilentPush");
