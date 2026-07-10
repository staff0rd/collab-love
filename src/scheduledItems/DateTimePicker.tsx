import { CalendarIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { cn } from "@/lib/utils.ts";

import { describe, parseValue } from "./dateTimeField.ts";

const DEFAULT_HOUR = 9;
const DEFAULT_MINUTE = 0;

type DateTimePickerProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
};

const DateTimePicker = ({ id, value, onChange }: DateTimePickerProps) => {
  const [open, setOpen] = useState(false);
  const selected = parseValue(value);
  const { timeValue, label, triggerClassName } = describe(selected);

  const emit = (date: Date) => onChange(date.toISOString());

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) {
      return;
    }
    let hours = DEFAULT_HOUR;
    let minutes = DEFAULT_MINUTE;
    if (selected) {
      hours = selected.getHours();
      minutes = selected.getMinutes();
    }
    emit(new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, minutes));
  };

  const handleTimeChange = (next: string) => {
    const [hoursPart, minutesPart] = next.split(":");
    if (hoursPart === undefined || minutesPart === undefined) {
      return;
    }
    const base = selected ?? new Date();
    emit(
      new Date(
        base.getFullYear(),
        base.getMonth(),
        base.getDate(),
        Number(hoursPart),
        Number(minutesPart),
      ),
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          className={cn("w-full justify-start gap-2 font-normal", triggerClassName)}
        >
          <CalendarIcon />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-3">
        <Calendar mode="single" selected={selected} onSelect={handleDaySelect} autoFocus />
        <Input
          type="time"
          aria-label="Time"
          value={timeValue}
          onChange={(event) => handleTimeChange(event.target.value)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateTimePicker;
