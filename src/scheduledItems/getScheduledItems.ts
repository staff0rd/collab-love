import { supabase } from "../lib/supabaseClient.ts";

export type ScheduledItem = {
  id: string;
  title: string;
  scheduledAt: string;
  notes: string | null;
  owner: string | null;
};

type ScheduledItemRow = {
  id: string;
  title: string;
  scheduled_at: string;
  notes: string | null;
  owner: string | null;
};

export const getScheduledItems = async (): Promise<ScheduledItem[]> => {
  const { data, error } = await supabase
    .from("scheduled_items")
    .select("id, title, scheduled_at, notes, owner")
    .order("scheduled_at", { ascending: true });
  if (error) {
    throw error;
  }

  return (data as ScheduledItemRow[]).map((row) => ({
    id: row.id,
    notes: row.notes,
    owner: row.owner,
    scheduledAt: row.scheduled_at,
    title: row.title,
  }));
};
