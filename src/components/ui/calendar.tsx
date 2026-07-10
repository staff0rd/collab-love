import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ComponentProps } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";

const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: ComponentProps<typeof DayPicker>) => {
  const defaults = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("select-none", className)}
      classNames={{
        button_next: cn(buttonVariants({ size: "icon", variant: "ghost" }), "size-8"),
        button_previous: cn(buttonVariants({ size: "icon", variant: "ghost" }), "size-8"),
        caption_label: "text-sm font-medium",
        day: "size-9 p-0 text-center text-sm",
        day_button: cn(
          buttonVariants({ size: "icon", variant: "ghost" }),
          "size-9 font-normal aria-selected:opacity-100",
        ),
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        month: "flex flex-col gap-4",
        month_caption: "flex h-9 items-center justify-center",
        month_grid: "w-full border-collapse",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        outside: "text-muted-foreground opacity-50",
        root: cn("relative", defaults.root),
        selected:
          "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary/90 [&>button]:hover:text-primary-foreground",
        today: "[&>button]:border [&>button]:border-primary",
        week: "mt-1 flex w-full",
        weekday: "w-9 text-xs font-normal text-muted-foreground",
        weekdays: "flex",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeft className="size-4" />;
          }
          return <ChevronRight className="size-4" />;
        },
      }}
      {...props}
    />
  );
};

export { Calendar };
