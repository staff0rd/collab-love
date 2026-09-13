import { AlertTriangle, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils.ts";

import { errorMessage } from "../lib/errorMessage.ts";

const PANEL_CLASSES =
  "flex flex-col items-center gap-1 rounded-lg border border-dashed py-16 text-center";

const LoadingState = () => (
  <div className="flex justify-center py-16 text-muted-foreground">
    <Loader2 className="size-6 animate-spin" />
  </div>
);

const ErrorState = ({ title, error }: { title: string; error: unknown }) => (
  <div className={cn(PANEL_CLASSES, "border-destructive/40 bg-destructive/5")}>
    <AlertTriangle className="mb-1 size-6 text-destructive" />
    <p className="font-medium">{title}</p>
    <p className="max-w-xs text-sm text-muted-foreground">{errorMessage(error)}</p>
  </div>
);

const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <div className={PANEL_CLASSES}>
    <p className="font-medium">{title}</p>
    <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
  </div>
);

type DataStatesProps = {
  loading: boolean;
  error: unknown;
  empty: boolean;
  errorTitle: string;
  emptyTitle: string;
  emptyDescription: string;
  children: ReactNode;
};

const DataStates = ({
  loading,
  error,
  empty,
  errorTitle,
  emptyTitle,
  emptyDescription,
  children,
}: DataStatesProps) => {
  if (loading) {
    return <LoadingState />;
  }
  if (error) {
    return <ErrorState title={errorTitle} error={error} />;
  }
  if (empty) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }
  return <>{children}</>;
};

export default DataStates;
