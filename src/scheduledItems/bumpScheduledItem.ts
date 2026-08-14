import { supabase } from "../lib/supabaseClient.ts";

import type { ScheduledItem } from "./getScheduledItems.ts";
import { snoozeTargetDate, type SnoozeTarget } from "./snoozeTarget.ts";

export type BumpScope = "occurrence" | "series";

type BumpRequest = { now: Date; scope: BumpScope; target: SnoozeTarget };

export const bumpScheduledItem = async (
  item: ScheduledItem,
  { now, scope, target }: BumpRequest,
): Promise<void> => {
  const bumped = snoozeTargetDate(target, new Date(item.scheduledAt), now).toISOString();
  const patch: Record<string, string | null> = { last_action: "bumped" };
  if (item.recurrence === "once" || scope === "series") {
    patch.scheduled_at = bumped;
    patch.bumped_to = null;
  } else {
    patch.bumped_to = bumped;
  }
  const { error } = await supabase.from("scheduled_items").update(patch).eq("id", item.id);
  if (error) {
    throw error;
  }
};
