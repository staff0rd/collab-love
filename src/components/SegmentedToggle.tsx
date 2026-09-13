import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";

export type SegmentedOption = {
  key: string;
  label: string;
  count?: number;
};

const variantFor = (selected: boolean): "default" | "outline" => {
  if (selected) {
    return "default";
  }
  return "outline";
};

const countStyle = (selected: boolean): string => {
  if (selected) {
    return "bg-primary-foreground/20";
  }
  return "bg-muted text-muted-foreground";
};

type SegmentedToggleProps<TOption extends SegmentedOption> = {
  ariaLabel: string;
  options: readonly TOption[];
  value: string;
  onChange: (option: TOption) => void;
  className?: string;
  optionClassName?: string;
};

const SegmentedToggle = <TOption extends SegmentedOption>({
  ariaLabel,
  options,
  value,
  onChange,
  className,
  optionClassName,
}: SegmentedToggleProps<TOption>) => (
  <div className={cn("flex gap-2", className)} role="group" aria-label={ariaLabel}>
    {options.map((option) => {
      const selected = option.key === value;
      return (
        <Button
          key={option.key}
          type="button"
          size="sm"
          variant={variantFor(selected)}
          aria-pressed={selected}
          className={optionClassName}
          onClick={() => onChange(option)}
        >
          {option.label}
          {option.count !== undefined && (
            <span
              className={cn("ml-1 rounded-full px-1.5 text-xs tabular-nums", countStyle(selected))}
            >
              {option.count}
            </span>
          )}
        </Button>
      );
    })}
  </div>
);

export default SegmentedToggle;
