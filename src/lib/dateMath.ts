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

export const shiftMonths = (date: Date, months: number) =>
  atTimeOf(new Date(date.getFullYear(), date.getMonth() + months, date.getDate()), date);
