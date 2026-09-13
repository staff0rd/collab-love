import { supabase } from "../lib/supabaseClient.ts";

import type { ScheduledItem } from "./getScheduledItems.ts";
import { nextOccurrence } from "./nextOccurrence.ts";
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

const bumpFrom = (item: ScheduledItem, now: Date): Date => {
  const occurrence = nextOccurrence(item, now);
  if (occurrence > now) {
    return occurrence;
  }
  return now;
};

export const bumpScheduledItem = async (
  item: ScheduledItem,
  { now, scope, target }: BumpRequest,
): Promise<void> => {
  const from = bumpFrom(item, now);
  const bumped = snoozeTargetDate(target, new Date(item.scheduledAt), from).toISOString();
  const { error } = await supabase
    .from("scheduled_items")
    .update({
      ...bumpedDateFields(item, scope, bumped),
      last_action: "bumped",
      last_intent: scheduledItemIntent(
        { action: "bump", bumpedFrom: from.toISOString(), computedTarget: bumped, scope, target },
        now,
      ),
    })
    .eq("id", item.id);
  if (error) {
    throw error;
  }
};
