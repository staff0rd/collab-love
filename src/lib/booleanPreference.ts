import { Preferences } from "@capacitor/preferences";

const ENABLED_VALUE = "true";

export const getBooleanPreference = async (key: string): Promise<boolean> => {
  const { value } = await Preferences.get({ key });
  return value === ENABLED_VALUE;
};

export const setBooleanPreference = async (key: string, enabled: boolean): Promise<void> => {
  if (enabled) {
    await Preferences.set({ key, value: ENABLED_VALUE });
    return;
  }
  await Preferences.remove({ key });
};
