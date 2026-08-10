import {
  createContext,
  useContext,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react";

import {
  ResponsiveContainer,
  Tooltip,
  type TooltipContentProps,
  type TooltipValueType,
} from "recharts";

import { cn } from "@/lib/utils.ts";

const NO_ROWS = 0;

const SURFACE_CLASSES =
  "text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-layer]:outline-none [&_.recharts-surface]:outline-none";

const TOOLTIP_CLASSES =
  "grid min-w-32 items-start gap-1.5 rounded-lg border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-lg";

type TooltipNameType = number | string;

export type ChartConfig = Record<string, { label?: ReactNode }>;

const ChartContext = createContext<ChartConfig | null>(null);

const useChartConfig = (): ChartConfig => {
  const config = useContext(ChartContext);
  if (!config) {
    throw new Error("Chart components must be used within a <ChartContainer />");
  }
  return config;
};

type ChartContainerProps = Omit<ComponentProps<"div">, "children"> & {
  config: ChartConfig;
  children: ComponentProps<typeof ResponsiveContainer>["children"];
};

const ChartContainer = ({ config, className, children, ...props }: ChartContainerProps) => (
  <ChartContext.Provider value={config}>
    <div className={cn(SURFACE_CLASSES, className)} {...props}>
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  </ChartContext.Provider>
);

const ChartTooltip = Tooltip;

type ChartTooltipContentProps = Partial<TooltipContentProps<TooltipValueType, TooltipNameType>> & {
  className?: string;
  hideIndicator?: boolean;
};

const ChartTooltipContent = ({
  active,
  payload,
  label,
  labelFormatter,
  formatter,
  className,
  hideIndicator = false,
}: ChartTooltipContentProps) => {
  const config = useChartConfig();
  const rows = payload?.filter((item) => item.type !== "none") ?? [];

  if (!active || rows.length === NO_ROWS) {
    return null;
  }

  return (
    <div className={cn(TOOLTIP_CLASSES, className)}>
      <div className="font-medium">{labelFormatter?.(label, rows) ?? label}</div>
      <div className="grid gap-1.5">
        {rows.map((item, index) => (
          <div key={String(item.dataKey ?? index)} className="flex items-center gap-2">
            {!hideIndicator && (
              <span
                className="size-2.5 shrink-0 rounded-[2px]"
                style={{ background: item.color } as CSSProperties}
              />
            )}
            {formatter?.(item.value, item.name, item, index, rows) ?? (
              <span className="flex flex-1 items-center justify-between gap-4">
                <span className="text-muted-foreground">
                  {config[String(item.dataKey)]?.label ?? item.name}
                </span>
                <span className="font-medium tabular-nums">{item.value}</span>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export { ChartContainer, ChartTooltip, ChartTooltipContent };
