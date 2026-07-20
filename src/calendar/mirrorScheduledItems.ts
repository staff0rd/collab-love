import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

import { type MirrorSummary, NO_PROGRESS, type ProgressReporter } from "./calendarEventOps.ts";
import { clearMirror } from "./clearMirror.ts";
import { reconcileMirror } from "./reconcileMirror.ts";
import { resyncMirror } from "./resyncMirror.ts";

let pending: Promise<unknown> = Promise.resolve();

const enqueue = <Result>(task: () => Promise<Result>): Promise<Result> => {
  const run = pending.then(task, task);
  pending = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
};

export const mirrorScheduledItems = (items: ScheduledItem[]): Promise<MirrorSummary> =>
  enqueue(() => reconcileMirror(items));

export const resyncMirroredEvents = (
  items: ScheduledItem[],
  report: ProgressReporter = NO_PROGRESS,
): Promise<MirrorSummary> => enqueue(() => resyncMirror(items, report));

export const clearMirroredEvents = (
  items: ScheduledItem[],
  report: ProgressReporter = NO_PROGRESS,
): Promise<void> => enqueue(() => clearMirror(items, report));
