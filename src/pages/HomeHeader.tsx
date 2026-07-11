import { Lightbulb, Plus, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { Button } from "@/components/ui/button.tsx";

import SignOutButton from "../auth/SignOutButton.tsx";
import type { Household } from "../household/getHousehold.ts";
import HouseholdSummary from "../household/HouseholdSummary.tsx";

type HomeHeaderProps = {
  household: Household | null;
  onAdd: () => void;
};

const HomeHeader = ({ household, onAdd }: HomeHeaderProps) => {
  const navigate = useNavigate();

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
        <div className="flex items-center gap-1">
          <Button size="sm" onClick={onAdd}>
            <Plus />
            Add item
          </Button>
          <Button asChild size="icon" variant="ghost" aria-label="Feature requests">
            <Link to="/requests">
              <Lightbulb />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Settings"
            onClick={() => void navigate("/settings")}
          >
            <Settings />
          </Button>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
