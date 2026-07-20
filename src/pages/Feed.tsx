import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button.tsx";

import ActivityFeed from "../activity/ActivityFeed.tsx";
import { useUnseenActivity } from "../activity/useUnseenActivity.ts";

const Feed = () => {
  const { entries, partner, loading, error, markSeen } = useUnseenActivity();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      markSeen();
    }
  }, [loading, markSeen]);

  return (
    <div className="flex h-full min-h-dvh flex-col bg-background">
      <header
        className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div
          className="mx-auto flex w-full max-w-2xl items-center gap-2 px-4 py-3"
          style={{
            paddingLeft: "max(1rem, env(safe-area-inset-left))",
            paddingRight: "max(1rem, env(safe-area-inset-right))",
          }}
        >
          <Button
            size="icon"
            variant="ghost"
            aria-label="Back"
            onClick={() => void navigate("/home")}
          >
            <ArrowLeft />
          </Button>
          <h1 className="truncate text-lg font-semibold text-foreground">Recent activity</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div
          className="mx-auto w-full max-w-2xl px-4 py-6"
          style={{
            paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
            paddingLeft: "max(1rem, env(safe-area-inset-left))",
            paddingRight: "max(1rem, env(safe-area-inset-right))",
          }}
        >
          <ActivityFeed entries={entries} partner={partner} loading={loading} error={error} />
        </div>
      </main>
    </div>
  );
};

export default Feed;
