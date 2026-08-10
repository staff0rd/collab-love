import { useEffect } from "react";

import ActivityFeed from "../activity/ActivityFeed.tsx";
import { useUnseenActivity } from "../activity/useUnseenActivity.ts";

import SubPage from "./SubPage.tsx";

const Feed = () => {
  const { entries, partner, loading, error, markSeen } = useUnseenActivity();

  useEffect(() => {
    if (!loading) {
      markSeen();
    }
  }, [loading, markSeen]);

  return (
    <SubPage title="Recent activity">
      <ActivityFeed entries={entries} partner={partner} loading={loading} error={error} />
    </SubPage>
  );
};

export default Feed;
