import { Activity, Lightbulb, LogOut, MoreVertical, Settings } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { Button } from "@/components/ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";

import ActivityBadge from "../activity/ActivityBadge.tsx";
import { useUnseenActivity } from "../activity/useUnseenActivity.ts";
import { signOut } from "../auth/signOut.ts";

const NO_UNSEEN = 0;

const moreOptionsLabel = (unseen: number): string => {
  if (unseen > NO_UNSEEN) {
    return `More options, ${unseen} new`;
  }
  return "More options";
};

const HomeMenu = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { count: unseenCount } = useUnseenActivity();

  return (
    <Popover open={menuOpen} onOpenChange={setMenuOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label={moreOptionsLabel(unseenCount)}
          className="relative -mr-2"
        >
          <MoreVertical />
          <ActivityBadge
            count={unseenCount}
            className="pointer-events-none absolute -right-0.5 -top-0.5"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-1">
        <Button
          asChild
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setMenuOpen(false)}
        >
          <Link to="/feed">
            <Activity />
            Recent activity
            <ActivityBadge count={unseenCount} className="ml-auto" />
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setMenuOpen(false)}
        >
          <Link to="/requests">
            <Lightbulb />
            Feature requests
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            setMenuOpen(false);
            void navigate("/settings");
          }}
        >
          <Settings />
          Settings
        </Button>
        <div className="my-1 border-t" />
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            setMenuOpen(false);
            void signOut();
          }}
        >
          <LogOut />
          Sign out
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default HomeMenu;
