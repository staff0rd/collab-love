export type ScheduledItemStatus = "overdue" | "today" | "upcoming";

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const scheduledItemStatus = (scheduledAt: string, now: Date): ScheduledItemStatus => {
  const day = startOfDay(new Date(scheduledAt)).getTime();
  const today = startOfDay(now).getTime();
  if (day < today) {
    return "overdue";
  }
  if (day === today) {
    return "today";
  }
  return "upcoming";
};
