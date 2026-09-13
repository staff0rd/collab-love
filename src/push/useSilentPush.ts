import { useEffect } from "react";

import { Capacitor } from "@capacitor/core";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";

import { scheduledItemsQueryKey } from "../scheduledItems/getScheduledItems.ts";

import { SilentPush } from "./silentPushBridge.ts";

const refresh = async (queryClient: QueryClient): Promise<void> => {
  try {
    await queryClient.invalidateQueries({ queryKey: scheduledItemsQueryKey });
  } finally {
    await SilentPush.handled();
  }
};

export const useSilentPush = (): void => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const handle = SilentPush.addListener("silentPush", () => {
      refresh(queryClient).catch((cause) => {
        console.error("Failed to refresh after a silent push", cause);
      });
    });

    return () => {
      void handle.then((listener) => listener.remove());
    };
  }, [queryClient]);
};
