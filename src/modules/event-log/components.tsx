import { dataFetcher } from "@/core/api";
import { ColumnCellNumber, ColumnHeader } from "@/core/components/ui/column";
import {
  DataController,
  DataQueryStateProps,
} from "@/core/components/ui/data-controller";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/core/components/ui/timeline";
import { messages } from "@/core/constants/messages";
import { filterFn } from "@/core/data-filter";
import { formatDate } from "@/core/utils/date";
import { createColumnHelper } from "@tanstack/react-table";
import { CalendarCheck2Icon, RouteIcon } from "lucide-react";
import { allEventLogType, EventLog, getEventLogMeta } from "./constants";
import { eventLogSchema } from "./schema";

const createEventLogColumn = createColumnHelper<EventLog>();
const getEventLogColumns = (count?: Record<string, number>) => [
  // createEventLogColumn.display({
  //   id: "select",
  //   header: (c) => <ColumnHeaderCheckbox table={c.table} />,
  //   cell: (c) => <ColumnCellCheckbox row={c.row} />,
  //   enableHiding: false,
  //   enableSorting: false,
  // }),
  createEventLogColumn.display({
    id: "no",
    header: "No",
    cell: (c) => <ColumnCellNumber table={c.table} row={c.row} />,
    enableHiding: false,
  }),
  createEventLogColumn.accessor((ac) => ac.type, {
    id: "type",
    header: (c) => <ColumnHeader column={c.column}>Tipe Event</ColumnHeader>,
    // cell: (c) => <UserRoleBadge value={c.cell.getValue()} />,
    cell: (c) => c.cell.getValue(),
    filterFn: filterFn("option"),
    meta: {
      label: "Tipe Event",
      type: "option",
      icon: RouteIcon,
      options: allEventLogType.map((value) => {
        const { displayName, icon } = getEventLogMeta(value);
        return { value, label: displayName, icon, count: count?.[value] };
      }),
    },
  }),
  createEventLogColumn.accessor((c) => c.createdAt, {
    id: "createdAt",
    header: (c) => <ColumnHeader column={c.column}>Waktu Dibuat</ColumnHeader>,
    cell: (c) => formatDate(c.cell.getValue(), "PPPp"),
    filterFn: filterFn("date"),
    meta: {
      label: "Waktu Dibuat",
      type: "date",
      icon: CalendarCheck2Icon,
    },
  }),
];

export function EventLogTimeline({
  url,
  userId,
  ...props
}: DataQueryStateProps &
  (
    | { url: "/event-log" | "/event-log/me"; userId?: never }
    | { url: "/event-log/:id"; userId: string }
  )) {
  const key = url === "/event-log/:id" ? `/event-log/${userId}` : url;
  const schema = eventLogSchema.array();

  return (
    <>
      <DataController
        {...props}
        query={{
          key,
          fetcher: async (state) => await dataFetcher(key, schema, state),
        }}
        columns={(res) => getEventLogColumns(res?.count)}
        render={({ result }) => {
          const { data: res } = result;

          if (!res?.data.length)
            return (
              <div className="flex justify-center text-center">
                <small>{messages.empty}</small>
              </div>
            );

          return (
            <Timeline orientation="vertical">
              {res.data.map((item, index) => {
                const {
                  displayName,
                  description,
                  icon: Icon,
                  color,
                } = getEventLogMeta(item.type, item);

                return (
                  <TimelineItem
                    key={index}
                    step={index}
                    style={{ "--timeline-color": color } as React.CSSProperties}
                    className="has-[+[data-completed]]:**:data-[slot=timeline-separator]:bg-(--timeline-color)/10"
                  >
                    <TimelineHeader>
                      <TimelineSeparator />

                      <TimelineIndicator className="flex size-8 items-center justify-center border-none bg-(--timeline-color)/10 text-(--timeline-color)">
                        <Icon className="size-4" />
                      </TimelineIndicator>

                      <TimelineDate>
                        {formatDate(item.createdAt, "PPPp")}
                      </TimelineDate>

                      <TimelineTitle className="text-(--timeline-color)">
                        {displayName}
                      </TimelineTitle>
                    </TimelineHeader>
                    <TimelineContent>{description}</TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          );
        }}
      />
    </>
  );
}
