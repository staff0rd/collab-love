import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import type { Calendar } from "@ebarooni/capacitor-calendar";

import { loadEnabledSelection } from "./calendarSyncOperations.ts";

export type SyncState = {
  calendars: Calendar[];
  enabled: boolean;
  selectedId: string | null;
};

const INITIAL: SyncState = { calendars: [], enabled: false, selectedId: null };

export const useCalendarSyncState = (
  supported: boolean,
): { setState: Dispatch<SetStateAction<SyncState>>; state: SyncState } => {
  const [state, setState] = useState<SyncState>(INITIAL);

  useEffect(() => {
    if (!supported) {
      return;
    }
    void loadEnabledSelection().then((loaded) => {
      if (loaded) {
        setState({ ...loaded, enabled: true });
      }
    });
  }, [supported]);

  return { setState, state };
};
