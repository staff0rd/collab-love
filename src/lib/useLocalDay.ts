import { useEffect, useState } from "react";

import { localDayValue } from "./localDayValue.ts";

const MINUTE_MS = 60_000;

const currentDay = () => localDayValue(new Date());

export const useLocalDay = (): string => {
  const [day, setDay] = useState(currentDay);

  useEffect(() => {
    const refresh = () => setDay(currentDay());
    const timer = window.setInterval(refresh, MINUTE_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return day;
};
