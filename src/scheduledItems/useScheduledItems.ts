import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../auth/useAuth.ts";

import { getScheduledItems, type ScheduledItem } from "./getScheduledItems.ts";

export const useScheduledItems = () => {
  const { session } = useAuth();
  const [items, setItems] = useState<ScheduledItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!session) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      setItems(await getScheduledItems());
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { items, loading, refresh };
};
