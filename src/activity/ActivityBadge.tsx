import { cn } from "@/lib/utils.ts";

const NONE = 0;
const MAX_DISPLAY = 9;

type ActivityBadgeProps = {
  count: number;
  className?: string;
};

const displayLabel = (count: number): string => {
  if (count > MAX_DISPLAY) {
    return `${MAX_DISPLAY}+`;
  }
  return String(count);
};

const ActivityBadge = ({ count, className }: ActivityBadgeProps) => {
  if (count <= NONE) {
    return null;
  }

  const label = displayLabel(count);

  return (
    <span
      aria-label={`${count} new`}
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold leading-5 text-primary-foreground",
        className,
      )}
    >
      {label}
    </span>
  );
};

export default ActivityBadge;
