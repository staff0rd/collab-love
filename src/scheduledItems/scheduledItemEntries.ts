import type { ScheduledItem } from "./getScheduledItems.ts";
import { nextOccurrence } from "./nextOccurrence.ts";

const SINGLE_DAY = 1;

export type ScheduledItemEntry = {
  key: string;
  item: ScheduledItem;
  title: string;
  occurrence: Date;
  isReminder: boolean;
};

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const subtractDays = (date: Date, days: number): Date =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - days,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  );

const reminderUnit = (days: number): string => {
  if (days === SINGLE_DAY) {
    return "day";
  }
  return "days";
};

export const reminderTitle = (days: number, title: string): string =>
  `${days} ${reminderUnit(days)} until ${title}`;

export const scheduledItemEntries = (item: ScheduledItem, now: Date): ScheduledItemEntry[] => {
  const occurrence = nextOccurrence(item, now);
  const entries: ScheduledItemEntry[] = [
    { isReminder: false, item, key: item.id, occurrence, title: item.title },
  ];
  if (item.reminderDaysBefore !== null) {
    const reminderDate = subtractDays(occurrence, item.reminderDaysBefore);
    if (startOfDay(reminderDate).getTime() >= startOfDay(now).getTime()) {
      entries.push({
        isReminder: true,
        item,
        key: `${item.id}:reminder`,
        occurrence: reminderDate,
        title: reminderTitle(item.reminderDaysBefore, item.title),
      });
    }
  }
  return entries;
};
