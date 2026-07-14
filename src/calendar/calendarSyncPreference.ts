import { Preferences } from "@capacitor/preferences";

const ENABLED_KEY = "calendar-sync-enabled";
const ENABLED_VALUE = "true";

export const getCalendarSyncEnabled = async (): Promise<boolean> => {
  const { value } = await Preferences.get({ key: ENABLED_KEY });
  return value === ENABLED_VALUE;
};

export const setCalendarSyncEnabled = async (enabled: boolean): Promise<void> => {
  if (enabled) {
    await Preferences.set({ key: ENABLED_KEY, value: ENABLED_VALUE });
    return;
  }
  await Preferences.remove({ key: ENABLED_KEY });
};
