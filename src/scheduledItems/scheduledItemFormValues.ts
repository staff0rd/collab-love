import { createScheduledItem, type NewScheduledItem } from "./createScheduledItem.ts";
import type { Recurrence, ScheduledItem } from "./getScheduledItems.ts";
import { updateScheduledItem } from "./updateScheduledItem.ts";

const DEFAULT_INTERVAL = 1;
const MIN_REMINDER_DAYS = 1;

export type FormValues = {
  title: string;
  scheduledAt: string;
  notes: string;
  ownerUserId: string | null;
  recurrence: Recurrence;
  interval: number;
  reminderDaysBefore: number | null;
};

export const EMPTY_VALUES: FormValues = {
  interval: DEFAULT_INTERVAL,
  notes: "",
  ownerUserId: null,
  recurrence: "once",
  reminderDaysBefore: null,
  scheduledAt: "",
  title: "",
};

export const valuesFrom = (item: ScheduledItem): FormValues => ({
  interval: item.recurrenceInterval ?? DEFAULT_INTERVAL,
  notes: item.notes ?? "",
  ownerUserId: item.ownerUserId,
  recurrence: item.recurrence,
  reminderDaysBefore: item.reminderDaysBefore,
  scheduledAt: item.scheduledAt,
  title: item.title,
});

const trimmedOrNull = (value: string) => {
  const trimmed = value.trim();
  if (trimmed === "") {
    return null;
  }
  return trimmed;
};

const intervalFor = (recurrence: Recurrence, interval: number): number | null => {
  if (recurrence === "daily" || recurrence === "weekly" || recurrence === "monthly") {
    return Math.max(DEFAULT_INTERVAL, Math.trunc(interval));
  }
  return null;
};

const reminderFor = (reminderDaysBefore: number | null): number | null => {
  if (reminderDaysBefore === null) {
    return null;
  }
  return Math.max(MIN_REMINDER_DAYS, Math.trunc(reminderDaysBefore));
};

const toPayload = (values: FormValues): NewScheduledItem => ({
  notes: trimmedOrNull(values.notes),
  ownerUserId: values.ownerUserId,
  recurrence: values.recurrence,
  recurrenceInterval: intervalFor(values.recurrence, values.interval),
  reminderDaysBefore: reminderFor(values.reminderDaysBefore),
  scheduledAt: values.scheduledAt,
  title: values.title.trim(),
});

export const persistScheduledItem = (editingId: string | null, values: FormValues) => {
  const payload = toPayload(values);
  if (editingId === null) {
    return createScheduledItem(payload);
  }
  return updateScheduledItem(editingId, payload);
};
