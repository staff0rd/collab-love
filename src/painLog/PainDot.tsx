import type { ReactNode } from "react";

import type { PainPoint } from "./painSeries.ts";

const RING_WIDTH = 2;

export type PainDotSizes = {
  readingRadius: number;
  extraRadius: number;
  readingRing: number;
};

type PainDotProps = {
  cx?: number;
  cy?: number;
  payload?: PainPoint;
};

const dotFill = (extraMedication: boolean) => {
  if (extraMedication) {
    return "var(--destructive)";
  }
  return "var(--primary)";
};

const dotShape = (point: PainPoint, sizes: PainDotSizes, active: boolean) => {
  if (active || point.extraMedication) {
    return { radius: sizes.extraRadius, ringWidth: RING_WIDTH };
  }
  return { radius: sizes.readingRadius, ringWidth: sizes.readingRing };
};

const painDot =
  (sizes: PainDotSizes, active: boolean) =>
  ({ cx, cy, payload }: PainDotProps): ReactNode => {
    if (cx === undefined || cy === undefined || payload === undefined) {
      return null;
    }
    const shape = dotShape(payload, sizes, active);

    return (
      <circle
        cx={cx}
        cy={cy}
        r={shape.radius}
        fill={dotFill(payload.extraMedication)}
        stroke="var(--card)"
        strokeWidth={shape.ringWidth}
      />
    );
  };

export const painDotRenderer = (sizes: PainDotSizes) => painDot(sizes, false);

export const painActiveDotRenderer = (sizes: PainDotSizes) => painDot(sizes, true);
