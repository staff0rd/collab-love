import { useEffect, useState } from "react";

const MINUTE_MS = 60_000;

export const useCurrentMinute = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), MINUTE_MS);
    return () => window.clearInterval(timer);
  }, []);

  return now;
};
