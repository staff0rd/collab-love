import { getBooleanPreference, setBooleanPreference } from "../lib/booleanPreference.ts";

const ENABLED_KEY = "pain-reminders-enabled";

const listeners = new Set<() => void>();

export const getPainRemindersEnabled = (): Promise<boolean> => getBooleanPreference(ENABLED_KEY);

export const setPainRemindersEnabled = async (enabled: boolean): Promise<void> => {
  await setBooleanPreference(ENABLED_KEY, enabled);
  for (const listener of listeners) {
    listener();
  }
};

export const subscribeToPainReminderPreference = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
