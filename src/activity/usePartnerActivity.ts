import { useMemo } from "react";

import { useAuth } from "../auth/useAuth.ts";
import type { HouseholdMember } from "../household/getHousehold.ts";
import { useHousehold } from "../household/useHousehold.ts";
import { useFeatureRequests } from "../featureRequests/useFeatureRequests.ts";
import { useScheduledItems } from "../scheduledItems/useScheduledItems.ts";

import { partnerActivity, type ActivityEntry } from "./partnerActivity.ts";

type PartnerActivity = {
  entries: ActivityEntry[];
  partner: HouseholdMember | null;
  loading: boolean;
  error: unknown;
};

export const usePartnerActivity = (): PartnerActivity => {
  const { session } = useAuth();
  const { household, loading: householdLoading } = useHousehold();
  const scheduled = useScheduledItems();
  const requests = useFeatureRequests();

  const currentUserId = session?.user.id ?? null;
  const partner = household?.members.find((member) => member.userId !== currentUserId) ?? null;

  const entries = useMemo(() => {
    if (!partner) {
      return [];
    }
    return partnerActivity(scheduled.items, requests.items, partner.userId);
  }, [partner, scheduled.items, requests.items]);

  return {
    entries,
    error: scheduled.error ?? (requests.error || undefined),
    loading: householdLoading || scheduled.loading || requests.loading,
    partner,
  };
};
