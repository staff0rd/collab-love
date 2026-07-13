const MS_PER_DAY = 86_400_000;
const SAME_DAY = 0;
const NEXT_DAY = 1;
const PREVIOUS_DAY = -1;

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const dayCount = (days: number) => {
  if (days === NEXT_DAY) {
    return `${days} day`;
  }
  return `${days} days`;
};

export const relativeDayLabel = (occurrence: Date, now: Date): string => {
  const days = Math.round(
    (startOfDay(occurrence).getTime() - startOfDay(now).getTime()) / MS_PER_DAY,
  );
  if (days === SAME_DAY) {
    return "Today";
  }
  if (days === NEXT_DAY) {
    return "Tomorrow";
  }
  if (days === PREVIOUS_DAY) {
    return "Yesterday";
  }
  if (days > SAME_DAY) {
    return `in ${dayCount(days)}`;
  }
  return `${dayCount(-days)} ago`;
};
