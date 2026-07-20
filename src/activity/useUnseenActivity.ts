import { useCallback, useEffect, useMemo, useState } from "react";

import type { HouseholdMember } from "../household/getHousehold.ts";

import { getActivityLastSeen, setActivityLastSeen } from "./activitySeen.ts";
import type { ActivityEntry } from "./partnerActivity.ts";
import { usePartnerActivity } from "./usePartnerActivity.ts";

const NONE = 0;

type UnseenActivity = {
  entries: ActivityEntry[];
  partner: HouseholdMember | null;
  loading: boolean;
  error: unknown;
  count: number;
  markSeen: () => void;
};

const seenThreshold = (entries: ActivityEntry[]): string => {
  const times = entries.map((entry) => new Date(entry.at).getTime());
  return new Date(Math.max(Date.now(), ...times)).toISOString();
};

export const useUnseenActivity = (): UnseenActivity => {
  const { entries, partner, loading, error } = usePartnerActivity();
  const [lastSeen, setLastSeen] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void getActivityLastSeen().then((stored) => {
      if (!active) {
        return;
      }
      const baseline = stored ?? new Date().toISOString();
      setLastSeen(baseline);
      if (!stored) {
        void setActivityLastSeen(baseline);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const count = useMemo(() => {
    if (lastSeen === null) {
      return NONE;
    }
    const threshold = new Date(lastSeen).getTime();
    return entries.filter((entry) => new Date(entry.at).getTime() > threshold).length;
  }, [entries, lastSeen]);

  const markSeen = useCallback(() => {
    const iso = seenThreshold(entries);
    setLastSeen(iso);
    void setActivityLastSeen(iso);
  }, [entries]);

  return { count, entries, error, loading, markSeen, partner };
};
