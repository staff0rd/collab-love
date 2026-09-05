const SUNDAY = 0;
const SATURDAY = 6;

export const isWeekday = (date: Date) => {
  const day = date.getDay();
  return day !== SUNDAY && day !== SATURDAY;
};

export const weekdayName = (date: Date) => date.toLocaleDateString(undefined, { weekday: "long" });
