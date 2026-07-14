import { Lightbulb, LogOut, MoreVertical, Plus, Settings } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { Button } from "@/components/ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";

import { signOut } from "../auth/signOut.ts";
import type { Household } from "../household/getHousehold.ts";
import HouseholdSummary from "../household/HouseholdSummary.tsx";
import ConnectionStatusIndicator from "../realtime/ConnectionStatusIndicator.tsx";

type HomeHeaderProps = {
  household: Household | null;
  onAdd: () => void;
};

const HomeHeader = ({ household, onAdd }: HomeHeaderProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div
        className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-4 py-3"
        style={{
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
        }}
      >
        <HouseholdSummary household={household} />
        <div className="flex shrink-0 items-center gap-2">
          <ConnectionStatusIndicator />
          <Button size="sm" onClick={onAdd}>
            <Plus />
            Add item
          </Button>
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost" aria-label="More options" className="-mr-2">
                <MoreVertical />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-52 p-1">
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
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
