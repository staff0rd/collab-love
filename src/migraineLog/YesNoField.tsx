import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils.ts";

import type { MigraineAnswer } from "./getMigraineLog.ts";
import MigraineField from "./MigraineField.tsx";

type YesTone = "alarm" | "default";

const OPTION_CLASSES =
  "h-9 min-w-14 rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const OPTIONS = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const nextAnswer = (selected: boolean, value: boolean): MigraineAnswer => {
  if (selected) {
    return null;
  }
  return value;
};

const optionClasses = (selected: boolean, alarm: boolean) => {
  if (!selected) {
    return "border-input hover:bg-accent";
  }
  if (alarm) {
    return "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90";
  }
  return "border-transparent bg-primary text-primary-foreground hover:bg-primary/90";
};

type YesNoFieldProps = {
  icon: LucideIcon;
  label: string;
  hint: string | null;
  value: MigraineAnswer;
  yesTone: YesTone;
  onChange: (value: MigraineAnswer) => void;
};

const YesNoField = ({ icon, label, hint, value, yesTone, onChange }: YesNoFieldProps) => (
  <MigraineField icon={icon} label={label} hint={hint}>
    <span role="group" aria-label={label} className="flex shrink-0 gap-1.5">
      {OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.label}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(nextAnswer(selected, option.value))}
            className={cn(
              OPTION_CLASSES,
              optionClasses(selected, option.value && yesTone === "alarm"),
            )}
          >
            {option.label}
          </button>
        );
      })}
    </span>
  </MigraineField>
);

export default YesNoField;
