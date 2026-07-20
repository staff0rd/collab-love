import type { Dispatch, SetStateAction } from "react";

import type { ScheduledItem } from "../scheduledItems/getScheduledItems.ts";

import type { MirrorProgress, MirrorSummary } from "./calendarEventOps.ts";
import {
  describeMirror,
  describeProgress,
  describeResync,
  disableCalendarSync,
  enableCalendarSync,
  mirrorInto,
  resyncInto,
  selectCalendarTarget,
} from "./calendarSyncOperations.ts";
import type { SyncState } from "./useCalendarSyncState.ts";
import { type Feedback, NO_FEEDBACK } from "./useGuardedAction.ts";

type Deps = {
  cooldownStart: () => void;
  items: ScheduledItem[];
  loading: boolean;
  run: (task: () => Promise<void>) => Promise<void>;
  selectedId: string | null;
  setFeedback: Dispatch<SetStateAction<Feedback>>;
  setState: Dispatch<SetStateAction<SyncState>>;
};

export const useCalendarSyncActions = (deps: Deps) => {
  const { cooldownStart, items, loading, run, selectedId, setFeedback, setState } = deps;

  const report = (summary: MirrorSummary, status: string) => {
    setState((current) => ({ ...current, selectedId: summary.calendarId }));
    setFeedback({ ...NO_FEEDBACK, status });
  };

  const reportProgress = (progress: MirrorProgress) => {
    setFeedback({ ...NO_FEEDBACK, status: describeProgress(progress) });
  };

  const mirrorAndReport = async () => {
    if (loading) {
      return;
    }
    const summary = await mirrorInto(items);
    report(summary, describeMirror(summary));
  };

  const resync = () =>
    run(async () => {
      if (loading) {
        return;
      }
      const summary = await resyncInto(items, reportProgress);
      report(summary, describeResync(summary));
      cooldownStart();
    });

  const toggle = (next: boolean) =>
    run(async () => {
      if (!next) {
        await disableCalendarSync(items, reportProgress);
        setState((current) => ({ ...current, enabled: false }));
        return;
      }
      const loaded = await enableCalendarSync();
      if (!loaded) {
        setFeedback({ ...NO_FEEDBACK, permissionDenied: true });
        return;
      }
      setState({ ...loaded, enabled: true });
      await mirrorAndReport();
    });

  const chooseCalendar = (id: string) => {
    if (id === selectedId) {
      return Promise.resolve();
    }
    return run(async () => {
      await selectCalendarTarget(id);
      await mirrorAndReport();
    });
  };

  return { chooseCalendar, resync, toggle };
};
