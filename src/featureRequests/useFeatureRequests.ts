import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../auth/useAuth.ts";

import { type FeatureRequest, getFeatureRequests } from "./getFeatureRequests.ts";

export const useFeatureRequests = () => {
  const { session } = useAuth();
  const [items, setItems] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!session) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      setItems(await getFeatureRequests());
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { items, loading, refresh };
};
