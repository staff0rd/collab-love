import SegmentedToggle from "../components/SegmentedToggle.tsx";

import type { OwnerFilterOption } from "./ownerFilterOptions.ts";

type OwnerFilterBarProps = {
  options: OwnerFilterOption[];
  value: string;
  onChange: (key: string) => void;
};

const OwnerFilterBar = ({ options, value, onChange }: OwnerFilterBarProps) => (
  <SegmentedToggle
    ariaLabel="Filter by owner"
    options={options}
    value={value}
    onChange={(option) => onChange(option.key)}
    className="-mx-4 mb-4 overflow-x-auto px-4"
    optionClassName="shrink-0"
  />
);

export default OwnerFilterBar;
