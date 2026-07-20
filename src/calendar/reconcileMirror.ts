import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

import {
  createEvent,
  deleteEvents,
  type MirrorSummary,
  requireCalendar,
  summaryFor,
} from "./calendarEventOps.ts";
import {
  type CalendarEventMap,
  getCalendarEventMap,
  setCalendarEventMap,
} from "./calendarEventStore.ts";
import { type DesiredEntry, desiredEntriesFor, fingerprintOf } from "./desiredCalendarEntries.ts";
import { ownedEventIdsByKey, scanCalendarEvents, scanWindow } from "./ownedCalendarEvents.ts";

type ReconcileContext = {
  existing: CalendarEventMap;
  owned: Map<string, Set<string>>;
};

const staleFor = (
  ownedIds: Set<string>,
  tracked: CalendarEventMap[string] | undefined,
): Set<string> => {
  const stale = new Set(ownedIds);
  if (tracked) {
    stale.add(tracked.eventId);
  }
  return stale;
};

const upsertEntry = async (
  entry: DesiredEntry,
  { existing, owned }: ReconcileContext,
): Promise<{ created: boolean; mirrored: CalendarEventMap[string] }> => {
  const ownedIds = owned.get(entry.key) ?? new Set<string>();
  const tracked = existing[entry.key];
  const fingerprint = fingerprintOf(entry.event);
  if (tracked && tracked.fingerprint === fingerprint && ownedIds.has(tracked.eventId)) {
    await deleteEvents([...ownedIds].filter((id) => id !== tracked.eventId));
    return { created: false, mirrored: tracked };
  }
  await deleteEvents(staleFor(ownedIds, tracked));
  return { created: true, mirrored: await createEvent(entry) };
};

const applyEntries = async (
  entries: DesiredEntry[],
  context: ReconcileContext,
): Promise<{ createdKeys: string[]; next: CalendarEventMap }> => {
  const next: CalendarEventMap = {};
  const createdKeys: string[] = [];
  for (const entry of entries) {
    const { created, mirrored } = await upsertEntry(entry, context);
    next[entry.key] = mirrored;
    if (created) {
      createdKeys.push(entry.key);
    }
  }
  return { createdKeys, next };
};

const deleteOrphans = async (
  owned: Map<string, Set<string>>,
  next: CalendarEventMap,
): Promise<void> => {
  for (const [key, ids] of owned) {
    if (!next[key]) {
      await deleteEvents(ids);
    }
  }
};

export const reconcileMirror = async (items: ScheduledItem[]): Promise<MirrorSummary> => {
  const calendar = await requireCalendar();
  const now = new Date();
  const entries = items.flatMap((item) => desiredEntriesFor(item, now, calendar.id));
  const owned = ownedEventIdsByKey(await scanCalendarEvents(scanWindow(entries, now)), calendar.id);
  const context: ReconcileContext = { existing: await getCalendarEventMap(), owned };
  const { createdKeys, next } = await applyEntries(entries, context);
  await deleteOrphans(owned, next);
  await setCalendarEventMap(next);
  return summaryFor(calendar, createdKeys.length, items.length);
};
