export type ScheduledItemStatus = "overdue" | "today" | "upcoming";

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const scheduledItemStatus = (occurrence: Date, now: Date): ScheduledItemStatus => {
  const day = startOfDay(occurrence).getTime();
  const today = startOfDay(now).getTime();
  if (day < today) {
    return "overdue";
  }
  if (day === today) {
    return "today";
  }
  return "upcoming";
};
