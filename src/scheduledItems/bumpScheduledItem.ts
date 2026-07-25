import { supabase } from "../lib/supabaseClient.ts";

import type { ScheduledItem } from "./getScheduledItems.ts";
import { snoozeTargetDate, type SnoozeTarget } from "./snoozeTarget.ts";

export const bumpScheduledItem = async (
  item: ScheduledItem,
  target: SnoozeTarget,
  now: Date,
): Promise<void> => {
  const bumped = snoozeTargetDate(target, new Date(item.scheduledAt), now).toISOString();
  const patch: Record<string, string> = { last_action: "bumped" };
  if (item.recurrence === "once") {
    patch.scheduled_at = bumped;
  } else {
    patch.bumped_to = bumped;
  }
  const { error } = await supabase.from("scheduled_items").update(patch).eq("id", item.id);
  if (error) {
    throw error;
  }
};
