import { createScheduledItem, type NewScheduledItem } from "./createScheduledItem.ts";
import type { Recurrence, ScheduledItem } from "./getScheduledItems.ts";
import { updateScheduledItem } from "./updateScheduledItem.ts";

const DEFAULT_INTERVAL = 1;

export type FormValues = {
  title: string;
  scheduledAt: string;
  notes: string;
  ownerUserId: string | null;
  recurrence: Recurrence;
  interval: number;
};

export const EMPTY_VALUES: FormValues = {
  interval: DEFAULT_INTERVAL,
  notes: "",
  ownerUserId: null,
  recurrence: "once",
  scheduledAt: "",
  title: "",
};

export const valuesFrom = (item: ScheduledItem): FormValues => ({
  interval: item.recurrenceInterval ?? DEFAULT_INTERVAL,
  notes: item.notes ?? "",
  ownerUserId: item.ownerUserId,
  recurrence: item.recurrence,
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

const toPayload = (values: FormValues): NewScheduledItem => ({
  notes: trimmedOrNull(values.notes),
  ownerUserId: values.ownerUserId,
  recurrence: values.recurrence,
  recurrenceInterval: intervalFor(values.recurrence, values.interval),
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
