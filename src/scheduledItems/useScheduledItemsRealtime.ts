import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { supabase } from "../lib/supabaseClient.ts";

import { scheduledItemsQueryKey } from "./getScheduledItems.ts";

export const useScheduledItemsRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("scheduled_items-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "scheduled_items" }, () => {
        void queryClient.invalidateQueries({ queryKey: scheduledItemsQueryKey });
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
