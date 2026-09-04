import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router";

const TOP = 0;
const MAX_REMEMBERED = 40;
const USER_TAKEOVER_EVENTS = ["wheel", "touchstart", "pointerdown", "keydown"] as const;

const positions = new Map<string, number>();

const remember = (keys: readonly string[], top: number) => {
  for (const key of keys) {
    positions.delete(key);
    positions.set(key, top);
  }
  while (positions.size > MAX_REMEMBERED) {
    const oldest = positions.keys().next();
    if (oldest.done) {
      return;
    }
    positions.delete(oldest.value);
  }
};

const recall = (keys: readonly string[]) => {
  for (const key of keys) {
    const top = positions.get(key);
    if (top !== undefined) {
      return top;
    }
  }
  return TOP;
};

const createRestorer = (element: HTMLElement, keys: readonly string[]) => {
  let target = recall(keys);
  let pending = target > TOP;

  const restore = () => {
    element.scrollTop = target;
    pending = element.scrollTop !== target;
  };

  return {
    abandon: () => {
      pending = false;
    },
    retry: () => {
      if (pending) {
        restore();
      }
    },
    save: () => {
      if (!pending) {
        target = element.scrollTop;
      }
      remember(keys, target);
    },
  };
};

type ScrollRestorer = ReturnType<typeof createRestorer>;

const observeGrowth = (element: HTMLElement, onGrowth: () => void) => {
  const observer = new ResizeObserver(onGrowth);
  observer.observe(element);
  for (const child of element.children) {
    observer.observe(child);
  }
  return () => observer.disconnect();
};

const trackScrolling = (element: HTMLElement, restorer: ScrollRestorer) => {
  element.addEventListener("scroll", restorer.save, { passive: true });
  for (const event of USER_TAKEOVER_EVENTS) {
    element.addEventListener(event, restorer.abandon, { passive: true });
  }
  return () => {
    element.removeEventListener("scroll", restorer.save);
    for (const event of USER_TAKEOVER_EVENTS) {
      element.removeEventListener(event, restorer.abandon);
    }
  };
};

export const useScrollRestoration = <TElement extends HTMLElement>() => {
  const ref = useRef<TElement>(null);
  const { key: historyKey, pathname, search } = useLocation();

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    const restorer = createRestorer(element, [historyKey, `${pathname}${search}`]);
    restorer.retry();
    const stopObserving = observeGrowth(element, restorer.retry);
    const stopTracking = trackScrolling(element, restorer);
    return () => {
      stopObserving();
      stopTracking();
    };
  }, [historyKey, pathname, search]);

  return ref;
};
