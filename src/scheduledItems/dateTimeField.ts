const PAD_LENGTH = 2;
const PLACEHOLDER = "Pick a date & time";

const pad = (value: number) => String(value).padStart(PAD_LENGTH, "0");

const toTimeValue = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

const formatDisplay = (date: Date) =>
  date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export const parseValue = (value: string) => {
  if (value) {
    return new Date(value);
  }
  return undefined;
};

type TriggerDisplay = { timeValue: string; label: string; triggerClassName: string };

export const describe = (selected: Date | undefined): TriggerDisplay => {
  if (selected) {
    return {
      label: formatDisplay(selected),
      timeValue: toTimeValue(selected),
      triggerClassName: "",
    };
  }
  return { label: PLACEHOLDER, timeValue: "", triggerClassName: "text-muted-foreground" };
};
