import { useState } from "react";

import { errorMessage } from "./calendarSyncOperations.ts";

export type Feedback = {
  error: string | null;
  permissionDenied: boolean;
  status: string | null;
};

export const NO_FEEDBACK: Feedback = { error: null, permissionDenied: false, status: null };

export const useGuardedAction = () => {
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(NO_FEEDBACK);

  const run = async (task: () => Promise<void>) => {
    setBusy(true);
    setFeedback(NO_FEEDBACK);
    try {
      await task();
    } catch (caught) {
      setFeedback({ ...NO_FEEDBACK, error: errorMessage(caught) });
    } finally {
      setBusy(false);
    }
  };

  return { busy, feedback, run, setFeedback };
};
