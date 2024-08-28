import { Text } from "@chakra-ui/react";
import { type CustomCellRendererProps } from "ag-grid-react";
import { format } from "date-fns/format";
import { isToday } from "date-fns/isToday";
import { isYesterday } from "date-fns/isYesterday";
import { isThisYear } from "date-fns/isThisYear";
import { type MaterialLogsTableColumns } from "./MaterialLogsTable";

export function CreatedAtRenderer({
  node,
}: CustomCellRendererProps<MaterialLogsTableColumns>) {
  if (!node.data) {
    return null;
  }

  const { createdAt } = node.data;
  const dateFormat = "MMM dd";
  const oldDateFormat = "MMM dd, yyyy";
  const timeFormat = "h:mm aa";

  function getDateFormat() {
    if (isToday(createdAt)) {
      return {
        date: "Today",
        time: format(createdAt, timeFormat),
      };
    }
    if (isYesterday(createdAt)) {
      return {
        date: "Yesterday",
        time: format(createdAt, timeFormat),
      };
    }
    if (isThisYear(createdAt)) {
      return {
        date: format(createdAt, dateFormat),
        time: format(createdAt, timeFormat),
      };
    }

    return {
      date: format(createdAt, oldDateFormat),
      time: format(createdAt, timeFormat),
    };
  }

  const { date, time } = getDateFormat();

  return (
    <Text>
      {date}, {time}
    </Text>
  );
}
