import { useEffect, useState } from "react";

import {
  getMigraineCardEnabled,
  subscribeToMigraineCardPreference,
} from "./migraineCardPreference.ts";

export const useMigraineCardEnabled = (): boolean => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const read = () => void getMigraineCardEnabled().then(setEnabled);
    read();
    return subscribeToMigraineCardPreference(read);
  }, []);

  return enabled;
};
