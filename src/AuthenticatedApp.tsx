import { LoaderCircle } from "lucide-react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { useAuth } from "./auth/useAuth.ts";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import ScheduledItemDetail from "./pages/ScheduledItemDetail.tsx";

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
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/items/:id" element={<ScheduledItemDetail />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AuthenticatedApp;
