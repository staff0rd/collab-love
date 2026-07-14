import { Preferences } from "@capacitor/preferences";

const SELECTED_CALENDAR_KEY = "calendar-selected-id";

export const getSelectedCalendarId = async (): Promise<string | null> => {
  const { value } = await Preferences.get({ key: SELECTED_CALENDAR_KEY });
  return value ?? null;
};

export const setSelectedCalendarId = async (id: string | null): Promise<void> => {
  if (id) {
    await Preferences.set({ key: SELECTED_CALENDAR_KEY, value: id });
    return;
  }
  await Preferences.remove({ key: SELECTED_CALENDAR_KEY });
};
