import { cn } from "@/lib/utils.ts";

const ExtraMedicationMark = ({ className }: { className?: string }) => (
  <span className={cn("inline-flex items-center gap-1.5", className)}>
    <span
      aria-hidden="true"
      className="size-2 shrink-0 rounded-full"
      style={{ background: "var(--destructive)" }}
    />
    Extra medication
  </span>
);

export default ExtraMedicationMark;
