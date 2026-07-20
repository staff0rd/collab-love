import { useEffect, useRef, useState } from "react";

const NONE = 0;
const STEP = 1;
const TICK_MS = 1000;

export const useCooldown = (seconds: number): { remaining: number; start: () => void } => {
  const [remaining, setRemaining] = useState(NONE);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(
    () => () => {
      clearInterval(timer.current);
    },
    [],
  );

  const start = () => {
    clearInterval(timer.current);
    setRemaining(seconds);
    timer.current = setInterval(() => {
      setRemaining((current) => {
        const next = current - STEP;
        if (next <= NONE) {
          clearInterval(timer.current);
          return NONE;
        }
        return next;
      });
    }, TICK_MS);
  };

  return { remaining, start };
};
