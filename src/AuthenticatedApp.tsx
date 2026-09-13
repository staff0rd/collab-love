import { LoaderCircle } from "lucide-react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { useAuth } from "./auth/useAuth.ts";
import CalendarSyncManager from "./calendar/CalendarSyncManager.tsx";
import Feed from "./pages/Feed.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Migraine from "./pages/Migraine.tsx";
import Pain from "./pages/Pain.tsx";
import Requests from "./pages/Requests.tsx";
import ScheduledItemDetail from "./pages/ScheduledItemDetail.tsx";
import Settings from "./pages/Settings.tsx";
import PainReminderManager from "./painReminders/PainReminderManager.tsx";
import PushTokenManager from "./push/PushTokenManager.tsx";
import { ConnectionStatusProvider } from "./realtime/ConnectionStatusProvider.tsx";
import WidgetSnapshotManager from "./widget/WidgetSnapshotManager.tsx";

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
      <ConnectionStatusProvider>
        <CalendarSyncManager />
        <PainReminderManager />
        <PushTokenManager />
        <WidgetSnapshotManager />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/migraine" element={<Migraine />} />
          <Route path="/pain" element={<Pain />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/items/:id" element={<ScheduledItemDetail />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </ConnectionStatusProvider>
    </BrowserRouter>
  );
};

export default AuthenticatedApp;
