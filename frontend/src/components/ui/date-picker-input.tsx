import * as Popover from "@radix-ui/react-popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange, DayPickerRangeProps } from "react-day-picker";

import Calendar from "./calendar";
import { cn } from "@/lib/utils";

interface DatePickerProps extends DayPickerRangeProps {
  placeholder?: string;
  label: string;
  error?: string;
}

const getDisplayText = (selected: DateRange | undefined) => {
  if (typeof selected === undefined) return;
  if (selected?.from && selected?.to) {
    return `${format(selected.from, "dd/MM/yy")} to ${format(selected.to, "dd/MM/yy")}`;
  }
};

export default function DatePickerInput(props: DatePickerProps) {
  const {
    id,
    label,
    error,
    placeholder = "Select date range",
    selected,
    ...rest
  } = props;

  const displayText = getDisplayText(selected) ?? placeholder;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="ml-1 text-left font-medium">
        {label}
      </label>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="flex h-14 w-full items-center gap-2 rounded-lg border border-muted bg-background px-4 text-left">
            <span className="sr-only">Date range selection</span>
            <CalendarIcon className="size-5 text-zinc-400" />
            <span
              className={cn(
                "flex-1 text-lg",
                !!getDisplayText(selected)
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {displayText}
            </span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="rounded-lg border border-muted bg-background">
            <Calendar selected={selected} {...rest} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {error && <span className="ml-1 text-left text-red-500">{error}</span>}
    </div>
  );
}
