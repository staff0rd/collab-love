import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

const positions = new Map<string, number>();

export const useScrollRestoration = <TElement extends HTMLElement>() => {
  const ref = useRef<TElement>(null);
  const { key } = useLocation();

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    const saved = positions.get(key);
    if (saved !== undefined) {
      element.scrollTop = saved;
    }
    const handleScroll = () => positions.set(key, element.scrollTop);
    element.addEventListener("scroll", handleScroll, { passive: true });
    return () => element.removeEventListener("scroll", handleScroll);
  }, [key]);

  return ref;
};
