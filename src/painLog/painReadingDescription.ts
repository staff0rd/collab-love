import type { PainReading } from "./getPainLog.ts";

export type PainLogDay = "today" | "yesterday";

export const painReadingDescription = (reading: PainReading | null, day: PainLogDay) => {
  if (day === "yesterday") {
    if (reading) {
      return "Recorded yesterday";
    }
    return "Yesterday's check-in";
  }
  if (reading) {
    return "Recorded earlier today";
  }
  return "Today's check-in";
};
