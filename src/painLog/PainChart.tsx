import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart.tsx";

import { painActiveDotRenderer, painDotRenderer, type PainDotSizes } from "./PainDot.tsx";
import type { PainPoint } from "./painSeries.ts";
import PainTooltipBody from "./PainTooltipBody.tsx";

const MIN_LEVEL = 0;
const MAX_LEVEL = 10;
const Y_TICK_STEP = 2;
const INCLUSIVE_END = 1;
const Y_TICKS = [...Array(MAX_LEVEL / Y_TICK_STEP + INCLUSIVE_END).keys()].map(
  (index) => index * Y_TICK_STEP,
);

const DENSE_POINTS = 60;
const MEDIUM_POINTS = 24;
const RING_WIDTH = 2;
const NO_RING = 0;
const LINE_WIDTH = 2;
const FIRST_ROW = 0;

const CHART_CONFIG: ChartConfig = { level: { label: "Pain level" } };

const CHART_MARGIN = { bottom: 0, left: 0, right: 16, top: 8 };

const DENSE_DOTS: PainDotSizes = { extraRadius: 3.5, readingRadius: 1.8, readingRing: NO_RING };
const MEDIUM_DOTS: PainDotSizes = { extraRadius: 4, readingRadius: 2.6, readingRing: NO_RING };
const SPARSE_DOTS: PainDotSizes = { extraRadius: 4.5, readingRadius: 3.5, readingRing: RING_WIDTH };

const dotSizes = (pointCount: number): PainDotSizes => {
  if (pointCount > DENSE_POINTS) {
    return DENSE_DOTS;
  }
  if (pointCount > MEDIUM_POINTS) {
    return MEDIUM_DOTS;
  }
  return SPARSE_DOTS;
};

const PainChart = ({ points }: { points: PainPoint[] }) => {
  const tickByKey = new Map(points.map((point) => [point.key, point.tick]));
  const tickKeys = points.filter((point) => point.tick !== "").map((point) => point.key);
  const sizes = dotSizes(points.length);

  return (
    <ChartContainer config={CHART_CONFIG} className="h-56 w-full sm:h-72">
      <LineChart accessibilityLayer data={points} margin={CHART_MARGIN}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="key"
          ticks={tickKeys}
          tickFormatter={(key: string) => tickByKey.get(key) ?? ""}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          dataKey="level"
          domain={[MIN_LEVEL, MAX_LEVEL]}
          ticks={Y_TICKS}
          width={26}
          tickLine={false}
          axisLine={false}
          tickMargin={4}
        />
        <ChartTooltip
          cursor={{ strokeWidth: 1 }}
          content={
            <ChartTooltipContent
              hideIndicator
              labelFormatter={(_label, rows) =>
                (rows[FIRST_ROW]?.payload as PainPoint | undefined)?.label
              }
              formatter={(_value, _name, item) => (
                <PainTooltipBody point={item.payload as PainPoint} />
              )}
            />
          }
        />
        <Line
          dataKey="level"
          type="linear"
          stroke="var(--primary)"
          strokeWidth={LINE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
          connectNulls={false}
          isAnimationActive={false}
          dot={painDotRenderer(sizes)}
          activeDot={painActiveDotRenderer(sizes)}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default PainChart;
