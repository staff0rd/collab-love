import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type MigraineFieldProps = {
  icon: LucideIcon;
  label: string;
  hint: string | null;
  children: ReactNode;
};

const MigraineField = ({ icon: Icon, label, hint, children }: MigraineFieldProps) => (
  <div className="flex min-h-11 items-center justify-between gap-3">
    <span className="flex min-w-0 items-center gap-2 text-[15px]">
      <Icon className="size-[17px] shrink-0 text-muted-foreground" />
      <span>
        {label}
        {hint !== null && <small className="block text-xs text-muted-foreground">{hint}</small>}
      </span>
    </span>
    {children}
  </div>
);

export default MigraineField;
