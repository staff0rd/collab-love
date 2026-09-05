import { AlertTriangle, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import { errorMessage } from "../lib/errorMessage.ts";

const REFRESHING_OPACITY = 0.6;
const SETTLED_OPACITY = 1;

const PANEL_CLASSES =
  "flex flex-col items-center gap-1 rounded-lg border border-dashed text-center";

const bodyOpacity = (refreshing: boolean) => {
  if (refreshing) {
    return REFRESHING_OPACITY;
  }
  return SETTLED_OPACITY;
};

const LoadingState = () => (
  <div className="flex justify-center py-24 text-muted-foreground">
    <Loader2 className="size-6 animate-spin" />
  </div>
);

const ErrorState = ({ title, error }: { title: string; error: unknown }) => (
  <div className={`${PANEL_CLASSES} border-destructive/40 bg-destructive/5 py-16`}>
    <AlertTriangle className="mb-1 size-6 text-destructive" />
    <p className="font-medium">{title}</p>
    <p className="max-w-xs text-sm text-muted-foreground">{errorMessage(error)}</p>
  </div>
);

const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <div className={`${PANEL_CLASSES} py-16`}>
    <p className="font-medium">{title}</p>
    <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
  </div>
);

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
}: OverviewStatesProps) => {
  if (loading) {
    return <LoadingState />;
  }
  if (error) {
    return <ErrorState title={errorTitle} error={error} />;
  }
  if (empty) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }
  return (
    <div
      className="flex flex-col gap-3 transition-opacity"
      style={{ opacity: bodyOpacity(refreshing) }}
    >
      {children}
    </div>
  );
};

export default OverviewStates;
