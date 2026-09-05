type StatTileProps = {
  label: string;
  value: string;
  suffix?: string;
};

const StatTile = ({ label, value, suffix }: StatTileProps) => (
  <div className="rounded-lg border bg-card px-4 py-3 text-card-foreground">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-0.5 text-2xl font-semibold">
      {value}
      {suffix && <span className="ml-1.5 text-sm font-normal text-muted-foreground">{suffix}</span>}
    </p>
  </div>
);

export default StatTile;
