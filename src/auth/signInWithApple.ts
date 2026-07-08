import { Capacitor } from "@capacitor/core";

import { signInWithAppleNative } from "./signInWithAppleNative.ts";
import { signInWithAppleWeb } from "./signInWithAppleWeb.ts";

export const signInWithApple = () => {
  if (Capacitor.isNativePlatform()) {
    return signInWithAppleNative();
  }
  return signInWithAppleWeb();
};
