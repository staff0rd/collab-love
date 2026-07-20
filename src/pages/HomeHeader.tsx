import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button.tsx";

import type { Household } from "../household/getHousehold.ts";
import HouseholdSummary from "../household/HouseholdSummary.tsx";
import ConnectionStatusIndicator from "../realtime/ConnectionStatusIndicator.tsx";

import HomeMenu from "./HomeMenu.tsx";

type HomeHeaderProps = {
  household: Household | null;
  onAdd: () => void;
};

const HomeHeader = ({ household, onAdd }: HomeHeaderProps) => (
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
        <HomeMenu />
      </div>
    </div>
  </header>
);

export default HomeHeader;
