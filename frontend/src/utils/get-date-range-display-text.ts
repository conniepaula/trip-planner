import { differenceInCalendarMonths, format } from "date-fns";

export function getDateRangeDisplayText(from: Date, to: Date) {
  const differenceInMonths = differenceInCalendarMonths(to, from);
  if (differenceInMonths === 0) {
    return format(from, "MMM do").concat(" to ").concat(format(to, "do"));
  }
  return format(from, "MMM do").concat(" to ").concat(format(to, "MMM do"));
}
