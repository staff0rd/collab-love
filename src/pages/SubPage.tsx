import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button.tsx";

const EDGE_PADDING = {
  paddingLeft: "max(1rem, env(safe-area-inset-left))",
  paddingRight: "max(1rem, env(safe-area-inset-right))",
};

type SubPageProps = {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
};

const SubPage = ({ title, actions, children }: SubPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full min-h-dvh flex-col bg-background">
      <header
        className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div
          className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-4 py-3"
          style={EDGE_PADDING}
        >
          <div className="flex min-w-0 items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              aria-label="Back"
              onClick={() => void navigate("/home")}
            >
              <ArrowLeft />
            </Button>
            <h1 className="truncate text-lg font-semibold text-foreground">{title}</h1>
          </div>
          {actions}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div
          className="mx-auto w-full max-w-2xl px-4 py-6"
          style={{ ...EDGE_PADDING, paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default SubPage;
