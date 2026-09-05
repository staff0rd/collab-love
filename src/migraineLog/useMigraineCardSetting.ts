import { useGuardedAction } from "../lib/useGuardedAction.ts";

import { setMigraineCardEnabled } from "./migraineCardPreference.ts";
import { useMigraineCardEnabled } from "./useMigraineCardEnabled.ts";

export const useMigraineCardSetting = () => {
  const enabled = useMigraineCardEnabled();
  const { busy, feedback, run } = useGuardedAction();

  const toggle = (next: boolean) => run(() => setMigraineCardEnabled(next));

  return { busy, enabled, error: feedback.error, toggle };
};
