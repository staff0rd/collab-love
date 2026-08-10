import { useEffect } from "react";

import type { RealtimeChannel } from "@supabase/supabase-js";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";

import { supabase } from "../lib/supabaseClient.ts";
import { PAIN_LOG_QUERY_PREFIX } from "../painLog/getPainLog.ts";
import { scheduledItemsQueryKey } from "../scheduledItems/getScheduledItems.ts";

import { pendingConnectionStatus, type ConnectionStatus } from "./connectionStatus.ts";

const CHANNEL_NAME = "household-changes";

type WatchedTable = {
  table: string;
  queryKey: readonly unknown[];
};

const WATCHED_TABLES: WatchedTable[] = [
  { queryKey: scheduledItemsQueryKey, table: "scheduled_items" },
  { queryKey: PAIN_LOG_QUERY_PREFIX, table: "pain_logs" },
];

type SubscriptionState = { channel: RealtimeChannel | null };

type StatusListener = (status: ConnectionStatus) => void;

const invalidate = (queryClient: QueryClient) => {
  for (const watched of WATCHED_TABLES) {
    void queryClient.invalidateQueries({ queryKey: watched.queryKey });
  }
};

const subscribe = (
  state: SubscriptionState,
  queryClient: QueryClient,
  onStatusChange: StatusListener,
) => {
  if (state.channel) {
    void supabase.removeChannel(state.channel);
  }
  onStatusChange("connecting");
  const channel = WATCHED_TABLES.reduce(
    (subscription, watched) =>
      subscription.on(
        "postgres_changes",
        { event: "*", schema: "public", table: watched.table },
        () => {
          void queryClient.invalidateQueries({ queryKey: watched.queryKey });
        },
      ),
    supabase.channel(CHANNEL_NAME),
  );
  state.channel = channel;
  channel.subscribe((status) => {
    const isStaleChannel = state.channel !== channel;
    if (isStaleChannel) {
      return;
    }
    if (status === "SUBSCRIBED") {
      onStatusChange("connected");
      invalidate(queryClient);
    } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
      onStatusChange(pendingConnectionStatus());
    }
  });
};

const recover = (
  state: SubscriptionState,
  queryClient: QueryClient,
  onStatusChange: StatusListener,
) => {
  const socketDown = !supabase.realtime.isConnected();
  const channelDown = state.channel === null || state.channel.state !== "joined";
  if (socketDown || channelDown) {
    subscribe(state, queryClient, onStatusChange);
  } else {
    invalidate(queryClient);
  }
};

const startRealtime = (queryClient: QueryClient, onStatusChange: StatusListener) => {
  const state: SubscriptionState = { channel: null };
  const handleRecover = () => recover(state, queryClient, onStatusChange);
  const handleOffline = () => onStatusChange("offline");
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      handleRecover();
    }
  };

  subscribe(state, queryClient, onStatusChange);
  window.addEventListener("online", handleRecover);
  window.addEventListener("offline", handleOffline);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    window.removeEventListener("online", handleRecover);
    window.removeEventListener("offline", handleOffline);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    if (state.channel) {
      void supabase.removeChannel(state.channel);
    }
  };
};

export const useHouseholdRealtime = (onStatusChange: StatusListener) => {
  const queryClient = useQueryClient();

  useEffect(() => startRealtime(queryClient, onStatusChange), [queryClient, onStatusChange]);
};
