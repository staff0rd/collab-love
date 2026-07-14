import { LoaderCircle } from "lucide-react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { useAuth } from "./auth/useAuth.ts";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Requests from "./pages/Requests.tsx";
import ScheduledItemDetail from "./pages/ScheduledItemDetail.tsx";
import Settings from "./pages/Settings.tsx";
import ScheduledItemsRealtime from "./scheduledItems/ScheduledItemsRealtime.tsx";

const AuthenticatedApp = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <ScheduledItemsRealtime />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/items/:id" element={<ScheduledItemDetail />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AuthenticatedApp;
