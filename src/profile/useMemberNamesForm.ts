import { useEffect, useState } from "react";

import { useAuth } from "../auth/useAuth.ts";
import { useHousehold } from "../household/useHousehold.ts";

import { setMemberName } from "./setMemberName.ts";

export const useMemberNamesForm = () => {
  const { session } = useAuth();
  const { household, loading: householdLoading } = useHousehold();
  const viewerUserId = session?.user.id;
  const [names, setNames] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!household) {
      return;
    }
    const seed: Record<string, string> = {};
    for (const member of household.members) {
      seed[member.userId] = member.displayName ?? "";
    }
    setNames(seed);
  }, [household]);

  const setName = (subjectUserId: string, value: string) => {
    setNames((current) => ({ ...current, [subjectUserId]: value }));
    setSaved(false);
  };

  const save = async () => {
    if (!household || !viewerUserId) {
      return;
    }
    setSaving(true);
    setSaved(false);
    try {
      for (const member of household.members) {
        await setMemberName({
          displayName: names[member.userId] ?? "",
          householdId: household.id,
          subjectUserId: member.userId,
          viewerUserId,
        });
      }
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return {
    loading: householdLoading,
    members: household?.members ?? [],
    names,
    save,
    saved,
    saving,
    setName,
    viewerUserId,
  };
};
