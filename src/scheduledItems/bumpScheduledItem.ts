import { supabase } from "../lib/supabaseClient.ts";

import type { ScheduledItem } from "./getScheduledItems.ts";
import { scheduledItemIntent } from "./scheduledItemIntent.ts";
import { snoozeTargetDate, type SnoozeTarget } from "./snoozeTarget.ts";

export type BumpScope = "occurrence" | "series";

type BumpRequest = { now: Date; scope: BumpScope; target: SnoozeTarget };

const bumpedDateFields = (item: ScheduledItem, scope: BumpScope, bumped: string) => {
  if (item.recurrence === "once" || scope === "series") {
    return { bumped_to: null, scheduled_at: bumped };
  }
  return { bumped_to: bumped };
};

export const bumpScheduledItem = async (
  item: ScheduledItem,
  { now, scope, target }: BumpRequest,
): Promise<void> => {
  const bumped = snoozeTargetDate(target, new Date(item.scheduledAt), now).toISOString();
  const { error } = await supabase
    .from("scheduled_items")
    .update({
      ...bumpedDateFields(item, scope, bumped),
      last_action: "bumped",
      last_intent: scheduledItemIntent(
        { action: "bump", computedTarget: bumped, scope, target },
        now,
      ),
    })
    .eq("id", item.id);
  if (error) {
    throw error;
  }
};
