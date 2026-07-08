import { useEffect, useState } from "react";

import { useAuth } from "../auth/useAuth.ts";

import { getHousehold, type Household } from "./getHousehold.ts";

export const useHousehold = () => {
  const { session } = useAuth();
  const [household, setHousehold] = useState<Household | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setHousehold(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    getHousehold()
      .then((result) => {
        if (active) {
          setHousehold(result);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [session]);

  return { household, loading };
};
