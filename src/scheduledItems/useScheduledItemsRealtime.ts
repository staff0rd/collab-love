import { useEffect } from "react";

import type { RealtimeChannel } from "@supabase/supabase-js";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";

import { supabase } from "../lib/supabaseClient.ts";
import { pendingConnectionStatus, type ConnectionStatus } from "../realtime/connectionStatus.ts";

import { scheduledItemsQueryKey } from "./getScheduledItems.ts";

const CHANNEL_NAME = "scheduled_items-changes";

type SubscriptionState = { channel: RealtimeChannel | null };

type StatusListener = (status: ConnectionStatus) => void;

const invalidate = (queryClient: QueryClient) => {
  void queryClient.invalidateQueries({ queryKey: scheduledItemsQueryKey });
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
  const channel = supabase
    .channel(CHANNEL_NAME)
    .on("postgres_changes", { event: "*", schema: "public", table: "scheduled_items" }, () =>
      invalidate(queryClient),
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

export const useScheduledItemsRealtime = (onStatusChange: StatusListener) => {
  const queryClient = useQueryClient();

  useEffect(() => startRealtime(queryClient, onStatusChange), [queryClient, onStatusChange]);
};
