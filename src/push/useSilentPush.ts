import { useEffect } from "react";

import { Capacitor } from "@capacitor/core";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";

import { useAuth } from "../auth/useAuth.ts";
import { getScheduledItems, scheduledItemsQueryKey } from "../scheduledItems/getScheduledItems.ts";
import { scheduledItemSnapshot } from "../widget/scheduledItemSnapshot.ts";
import { writeScheduledItemSnapshot } from "../widget/scheduledItemSnapshotStore.ts";

import { SilentPush } from "./silentPushBridge.ts";

const refreshWidgetBeforeSuspending = async (
  queryClient: QueryClient,
  userId: string,
): Promise<void> => {
  try {
    const items = await queryClient.fetchQuery({
      queryFn: getScheduledItems,
      queryKey: scheduledItemsQueryKey,
      staleTime: 0,
    });
    await writeScheduledItemSnapshot(scheduledItemSnapshot(items, userId, new Date()));
  } finally {
    await SilentPush.handled();
  }
};

export const useSilentPush = (): void => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id ?? null;

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || userId === null) {
      return;
    }

    const handle = SilentPush.addListener("silentPush", () => {
      refreshWidgetBeforeSuspending(queryClient, userId).catch((cause) => {
        console.error("Failed to refresh after a silent push", cause);
      });
    });

    return () => {
      void handle.then((listener) => listener.remove());
    };
  }, [queryClient, userId]);
};
