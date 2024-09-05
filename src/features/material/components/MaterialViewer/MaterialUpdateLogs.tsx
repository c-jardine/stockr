import { Heading, Stack, StackDivider } from "@chakra-ui/react";
import { isToday } from "date-fns/isToday";
import { isYesterday } from "date-fns/isYesterday";
import { type RouterOutputs } from "~/utils/api";
import { getDateFormat, getHistoryDateLabel } from "~/utils/date";
import MaterialUpdateLog from "./MaterialUpdateLog";

interface MaterialUpdateLogsProps {
  updates: RouterOutputs["material"]["getQuantityUpdatesById"];
}

type DataItem = MaterialUpdateLogsProps["updates"][0];
interface GroupedData {
  dateGroup: string;
  data: DataItem[];
}

export default function MaterialUpdateLogs({
  updates,
}: MaterialUpdateLogsProps) {
  const groupedData: GroupedData[] = [];

  updates.forEach((item) => {
    const dateGroup = getHistoryDateLabel(item.createdAt);

    // Find if a group for the dateGroup already exists
    let group = groupedData.find((g) => g.dateGroup === dateGroup);

    if (!group) {
      // Create a new group if it doesn't exist
      group = { dateGroup: dateGroup, data: [] };
      groupedData.push(group);
    }

    group.data.push(item);
  });

  return (
    <Stack spacing={6} divider={<StackDivider />}>
      {groupedData.map(({ dateGroup, data }) => {
        return (
          <>
            <Heading as="h4" mb={2} fontSize="sm">
              {dateGroup}
            </Heading>
            <Stack spacing={0}>
              {data.map(({ id, notes, createdBy, createdAt, type }) => {
                const { date, time } = getDateFormat(createdAt);

                return (
                  <MaterialUpdateLog
                    key={id}
                    title={type.type}
                    description={notes}
                    timestamp={
                      isToday(createdAt) || isYesterday(createdAt)
                        ? time
                        : `${date}, ${time}`
                    }
                    createdBy={createdBy}
                  />
                );
              })}
            </Stack>
          </>
        );
      })}
    </Stack>
  );
}
