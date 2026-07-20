import { Preferences } from "@capacitor/preferences";

const ACTIVITY_LAST_SEEN_KEY = "activity-last-seen";

export const getActivityLastSeen = async (): Promise<string | null> => {
  const { value } = await Preferences.get({ key: ACTIVITY_LAST_SEEN_KEY });
  return value ?? null;
};

export const setActivityLastSeen = async (iso: string): Promise<void> => {
  await Preferences.set({ key: ACTIVITY_LAST_SEEN_KEY, value: iso });
};
