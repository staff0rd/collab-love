import { Preferences } from "@capacitor/preferences";

const EVENT_MAP_KEY = "calendar-event-ids";

type MirroredEvent = {
  eventId: string;
  fingerprint: string;
};

export type CalendarEventMap = Record<string, MirroredEvent>;

const normalizeEntry = (value: unknown): MirroredEvent | null => {
  if (typeof value === "string") {
    return { eventId: value, fingerprint: "" };
  }
  if (typeof value === "object" && value !== null) {
    const { eventId, fingerprint } = value as Partial<MirroredEvent>;
    if (typeof eventId === "string") {
      return { eventId, fingerprint: fingerprint ?? "" };
    }
  }
  return null;
};

const parseEventMap = (value: string): CalendarEventMap => {
  const parsed = JSON.parse(value) as Record<string, unknown>;
  const map: CalendarEventMap = {};
  for (const [itemId, entry] of Object.entries(parsed)) {
    const normalized = normalizeEntry(entry);
    if (normalized) {
      map[itemId] = normalized;
    }
  }
  return map;
};

export const getCalendarEventMap = async (): Promise<CalendarEventMap> => {
  const { value } = await Preferences.get({ key: EVENT_MAP_KEY });
  if (!value) {
    return {};
  }
  try {
    return parseEventMap(value);
  } catch {
    return {};
  }
};

export const setCalendarEventMap = async (map: CalendarEventMap): Promise<void> => {
  await Preferences.set({ key: EVENT_MAP_KEY, value: JSON.stringify(map) });
};
