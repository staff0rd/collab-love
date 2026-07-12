import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { type ComponentProps, type CSSProperties, useEffect, useState } from "react";

import { cn } from "@/lib/utils.ts";

const Sheet = DialogPrimitive.Root;

const DESKTOP_QUERY = "(min-width: 640px)";

const useVisibleViewport = (): CSSProperties => {
  const [style, setStyle] = useState<CSSProperties>({});

  useEffect(() => {
    const viewport = window.visualViewport;
    const desktop = window.matchMedia(DESKTOP_QUERY);

    const update = () => {
      if (desktop.matches || !viewport) {
        setStyle({});
        return;
      }
      setStyle({
        height: `${viewport.height}px`,
        transform: `translateY(${viewport.offsetTop}px)`,
      });
    };
    update();
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    desktop.addEventListener("change", update);
    return () => {
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      desktop.removeEventListener("change", update);
    };
  }, []);

  return style;
};

const SheetContent = ({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) => {
  const viewportStyle = useVisibleViewport();
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <DialogPrimitive.Content
        onOpenAutoFocus={(event) => event.preventDefault()}
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex h-dvh flex-col overflow-hidden bg-background",
          "sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[85dvh] sm:w-[calc(100%-2rem)] sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:border sm:shadow-lg",
          className,
        )}
        style={viewportStyle}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className="absolute right-3 z-10 rounded-sm p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          style={{ top: "max(0.75rem, env(safe-area-inset-top))" }}
        >
          <X className="size-5" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
};

const SheetHeader = ({ className, style, ...props }: ComponentProps<"div">) => (
  <div
    className={cn("shrink-0 border-b px-4 pb-3", className)}
    style={{
      paddingLeft: "max(1rem, env(safe-area-inset-left))",
      paddingRight: "max(1rem, env(safe-area-inset-right))",
      paddingTop: "max(0.75rem, env(safe-area-inset-top))",
      ...style,
    }}
    {...props}
  />
);

const SheetBody = ({ className, style, ...props }: ComponentProps<"div">) => (
  <div
    className={cn("min-h-0 flex-1 overflow-y-auto px-4 py-4", className)}
    style={{
      paddingLeft: "max(1rem, env(safe-area-inset-left))",
      paddingRight: "max(1rem, env(safe-area-inset-right))",
      ...style,
    }}
    {...props}
  />
);

const SheetFooter = ({ className, style, ...props }: ComponentProps<"div">) => (
  <div
    className={cn("flex shrink-0 justify-end gap-2 border-t px-4 pt-3", className)}
    style={{
      paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
      paddingLeft: "max(1rem, env(safe-area-inset-left))",
      paddingRight: "max(1rem, env(safe-area-inset-right))",
      ...style,
    }}
    {...props}
  />
);

const SheetTitle = ({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) => (
  <DialogPrimitive.Title
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
);

const SheetDescription = ({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) => (
  <DialogPrimitive.Description
    className={cn("mt-1.5 text-sm text-muted-foreground", className)}
    {...props}
  />
);

export { Sheet, SheetContent, SheetHeader, SheetBody, SheetFooter, SheetTitle, SheetDescription };
