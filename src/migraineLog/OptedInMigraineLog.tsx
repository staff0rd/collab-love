import TodayMigraineLog from "./TodayMigraineLog.tsx";
import { useMigraineCardEnabled } from "./useMigraineCardEnabled.ts";

const OptedInMigraineLog = () => {
  const enabled = useMigraineCardEnabled();

  if (!enabled) {
    return null;
  }
  return <TodayMigraineLog />;
};

export default OptedInMigraineLog;
