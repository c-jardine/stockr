import { format } from "date-fns/format";
import { isThisMonth } from "date-fns/isThisMonth";
import { isThisYear } from "date-fns/isThisYear";
import { isToday } from "date-fns/isToday";
import { isYesterday } from "date-fns/isYesterday";

const dateFormat = "MMM dd";
const oldDateFormat = "MMM dd, yyyy";
const timeFormat = "h:mm aa";

export function getDateFormat(date: Date) {
  if (isToday(date)) {
    return {
      date: "Today",
      time: format(date, timeFormat),
    };
  }
  if (isYesterday(date)) {
    return {
      date: "Yesterday",
      time: format(date, timeFormat),
    };
  }
  if (isThisYear(date)) {
    return {
      date: format(date, dateFormat),
      time: format(date, timeFormat),
    };
  }

  return {
    date: format(date, oldDateFormat),
    time: format(date, timeFormat),
  };
}

export function getHistoryDateLabel(date: Date) {
  let dateLabel = "";

  if (isToday(date)) {
    dateLabel = "Today";
  } else if (isYesterday(date)) {
    dateLabel = "Yesterday";
  } else if (isThisMonth(date)) {
    dateLabel = format(date, "MMMM");
  } else if (isThisYear(date)) {
    dateLabel = format(date, "MMMM");
  } else {
    dateLabel = format(date, "yyyy");
  }

  return dateLabel;
}
