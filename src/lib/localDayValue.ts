const MONTH_OFFSET = 1;
const DATE_PAD = 2;

export const localDayValue = (date: Date): string => {
  const month = String(date.getMonth() + MONTH_OFFSET).padStart(DATE_PAD, "0");
  const day = String(date.getDate()).padStart(DATE_PAD, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};
