import type { ReactNode } from "react";

import DataStates from "./DataStates.tsx";

const REFRESHING_OPACITY = 0.6;
const SETTLED_OPACITY = 1;

const bodyOpacity = (refreshing: boolean) => {
  if (refreshing) {
    return REFRESHING_OPACITY;
  }
  return SETTLED_OPACITY;
};

type OverviewStatesProps = {
  loading: boolean;
  error: unknown;
  empty: boolean;
  refreshing: boolean;
  errorTitle: string;
  emptyTitle: string;
  emptyDescription: string;
  children: ReactNode;
};

const OverviewStates = ({
  loading,
  error,
  empty,
  refreshing,
  errorTitle,
  emptyTitle,
  emptyDescription,
  children,
}: OverviewStatesProps) => (
  <DataStates
    loading={loading}
    error={error}
    empty={empty}
    errorTitle={errorTitle}
    emptyTitle={emptyTitle}
    emptyDescription={emptyDescription}
  >
    <div
      className="flex flex-col gap-3 transition-opacity"
      style={{ opacity: bodyOpacity(refreshing) }}
    >
      {children}
    </div>
  </DataStates>
);

export default OverviewStates;
