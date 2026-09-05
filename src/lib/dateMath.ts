export const atTimeOf = (base: Date, source: Date) =>
  new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate(),
    source.getHours(),
    source.getMinutes(),
    source.getSeconds(),
  );

export const addDays = (date: Date, days: number) =>
  atTimeOf(new Date(date.getFullYear(), date.getMonth(), date.getDate() + days), date);

const DAYS_IN_WEEK = 7;
const MONDAY = 1;

export const addWeeks = (date: Date, weeks: number) => addDays(date, weeks * DAYS_IN_WEEK);

export const startOfWeek = (date: Date) =>
  addDays(date, -((date.getDay() + DAYS_IN_WEEK - MONDAY) % DAYS_IN_WEEK));

export const shiftMonths = (date: Date, months: number) =>
  atTimeOf(new Date(date.getFullYear(), date.getMonth() + months, date.getDate()), date);
