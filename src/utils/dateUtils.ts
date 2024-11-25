import { formatInTimeZone } from 'date-fns-tz';
import { parseISO } from 'date-fns';

import { formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz';

export const formatToEST = (
  dateInput: string | Date,
  formatStr: string = "MMM d, h:mm a 'ET'"
) => {
  let date: Date;

  if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    // Remove 'Z' at the end of the date string
    const dateString = dateInput.endsWith('Z') ? dateInput.slice(0, -1) : dateInput;

    // Interpret the date string as being in 'America/New_York' timezone
    date = zonedTimeToUtc(dateString, 'America/New_York');
  }

  // Now format the date in 'America/New_York' timezone
  return formatInTimeZone(date, 'America/New_York', formatStr);
};


export const formatDateForInput = (dateString: string) => {
  return formatInTimeZone(parseISO(dateString), 'America/New_York', 'yyyy-MM-dd');
};