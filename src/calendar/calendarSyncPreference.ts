import { getBooleanPreference, setBooleanPreference } from "../lib/booleanPreference.ts";

const ENABLED_KEY = "calendar-sync-enabled";

export const getCalendarSyncEnabled = (): Promise<boolean> => getBooleanPreference(ENABLED_KEY);

export const setCalendarSyncEnabled = (enabled: boolean): Promise<void> =>
  setBooleanPreference(ENABLED_KEY, enabled);
