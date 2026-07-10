import type { ScheduledItem } from "./getScheduledItems.ts";
import { nextOccurrence } from "./nextOccurrence.ts";

export type ScheduledItemGroup = {
  key: string;
  label: string;
  items: ScheduledItem[];
};

type DayContext = { todayKey: number; tomorrowKey: number };

const NEXT_DAY = 1;
const OVERDUE_KEY = "overdue";

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const dayContext = (now: Date): DayContext => {
  const todayStart = startOfDay(now);
  const tomorrowStart = new Date(
    todayStart.getFullYear(),
    todayStart.getMonth(),
    todayStart.getDate() + NEXT_DAY,
  );
  return { todayKey: todayStart.getTime(), tomorrowKey: tomorrowStart.getTime() };
};

const describeDay = (day: Date, context: DayContext): { key: string; label: string } => {
  const dayKey = day.getTime();
  if (dayKey < context.todayKey) {
    return { key: OVERDUE_KEY, label: "Overdue" };
  }
  if (dayKey === context.todayKey) {
    return { key: String(dayKey), label: "Today" };
  }
  if (dayKey === context.tomorrowKey) {
    return { key: String(dayKey), label: "Tomorrow" };
  }
  const label = day.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    weekday: "long",
  });
  return { key: String(dayKey), label };
};

const addItem = (
  byKey: Map<string, ScheduledItemGroup>,
  item: ScheduledItem,
  descriptor: { key: string; label: string },
): void => {
  const existing = byKey.get(descriptor.key);
  if (existing) {
    existing.items.push(item);
    return;
  }
  byKey.set(descriptor.key, { items: [item], key: descriptor.key, label: descriptor.label });
};

export const groupScheduledItems = (items: ScheduledItem[], now: Date): ScheduledItemGroup[] => {
  const context = dayContext(now);
  const scheduled = items
    .map((item) => ({ item, occurrence: nextOccurrence(item, now) }))
    .sort((left, right) => left.occurrence.getTime() - right.occurrence.getTime());
  const byKey = new Map<string, ScheduledItemGroup>();
  for (const { item, occurrence } of scheduled) {
    addItem(byKey, item, describeDay(startOfDay(occurrence), context));
  }
  return [...byKey.values()];
};
