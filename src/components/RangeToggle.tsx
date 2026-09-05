import { Button } from "@/components/ui/button.tsx";

type RangeOption = {
  key: string;
  label: string;
};

const variantFor = (selected: boolean): "default" | "outline" => {
  if (selected) {
    return "default";
  }
  return "outline";
};

type RangeToggleProps<TRange extends RangeOption> = {
  ariaLabel: string;
  options: readonly TRange[];
  value: string;
  onChange: (range: TRange) => void;
};

const RangeToggle = <TRange extends RangeOption>({
  ariaLabel,
  options,
  value,
  onChange,
}: RangeToggleProps<TRange>) => (
  <div className="flex gap-2" role="group" aria-label={ariaLabel}>
    {options.map((option) => {
      const selected = option.key === value;
      return (
        <Button
          key={option.key}
          type="button"
          size="sm"
          variant={variantFor(selected)}
          aria-pressed={selected}
          className="flex-1 sm:flex-none sm:px-6"
          onClick={() => onChange(option)}
        >
          {option.label}
        </Button>
      );
    })}
  </div>
);

export default RangeToggle;
