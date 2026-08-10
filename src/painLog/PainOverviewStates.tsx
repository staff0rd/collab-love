import { AlertTriangle, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import { errorMessage } from "../lib/errorMessage.ts";

import type { PainSeries } from "./painSeries.ts";

const NO_READINGS = 0;

const PANEL_CLASSES =
  "flex flex-col items-center gap-1 rounded-lg border border-dashed text-center";

const LoadingState = () => (
  <div className="flex justify-center py-24 text-muted-foreground">
    <Loader2 className="size-6 animate-spin" />
  </div>
);

const ErrorState = ({ error }: { error: unknown }) => (
  <div className={`${PANEL_CLASSES} border-destructive/40 bg-destructive/5 py-16`}>
    <AlertTriangle className="mb-1 size-6 text-destructive" />
    <p className="font-medium">Couldn&apos;t load pain readings</p>
    <p className="max-w-xs text-sm text-muted-foreground">{errorMessage(error)}</p>
  </div>
);

const EmptyState = ({ rangeLabel }: { rangeLabel: string }) => (
  <div className={`${PANEL_CLASSES} py-16`}>
    <p className="font-medium">No readings yet</p>
    <p className="max-w-xs text-sm text-muted-foreground">
      Nothing was recorded in the last {rangeLabel.toLowerCase()}. Check-ins recorded on Home show
      up here.
    </p>
  </div>
);

type PainOverviewStatesProps = {
  series: PainSeries;
  rangeLabel: string;
  loading: boolean;
  error: unknown;
  children: ReactNode;
};

const PainOverviewStates = ({
  series,
  rangeLabel,
  loading,
  error,
  children,
}: PainOverviewStatesProps) => {
  if (loading) {
    return <LoadingState />;
  }
  if (error) {
    return <ErrorState error={error} />;
  }
  if (series.readingCount === NO_READINGS) {
    return <EmptyState rangeLabel={rangeLabel} />;
  }
  return children;
};

export default PainOverviewStates;
