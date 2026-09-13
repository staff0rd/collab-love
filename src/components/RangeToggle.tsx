import SegmentedToggle, { type SegmentedOption } from "./SegmentedToggle.tsx";

type RangeToggleProps<TRange extends SegmentedOption> = {
  ariaLabel: string;
  options: readonly TRange[];
  value: string;
  onChange: (range: TRange) => void;
};

const RangeToggle = <TRange extends SegmentedOption>({
  ariaLabel,
  options,
  value,
  onChange,
}: RangeToggleProps<TRange>) => (
  <SegmentedToggle
    ariaLabel={ariaLabel}
    options={options}
    value={value}
    onChange={onChange}
    optionClassName="flex-1 sm:flex-none sm:px-6"
  />
);

export default RangeToggle;
