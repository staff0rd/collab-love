import { useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { createContext, useEffect, useState, type ReactNode } from "react";

import { prefetchAppData } from "../lib/prefetchAppData.ts";
import { supabase } from "../lib/supabaseClient.ts";

type AuthContextValue = {
  session: Session | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id ?? null;
  useEffect(() => {
    if (userId) {
      prefetchAppData(queryClient);
    }
  }, [userId, queryClient]);

  return <AuthContext.Provider value={{ loading, session }}>{children}</AuthContext.Provider>;
};
