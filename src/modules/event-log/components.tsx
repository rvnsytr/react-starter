import { fetcher } from "@/core/api";
import { ColumnCellNumber, ColumnHeader } from "@/core/components/ui/column";
import {
  DataController,
  DataControllerPageSize,
  DataControllerPaginationNav,
  DataQueryStateProps,
} from "@/core/components/ui/data-controller";
import {
  ActiveFilters,
  ActiveFiltersContainer,
  ClearFilters,
  FilterSelector,
  ResetFilters,
} from "@/core/components/ui/data-filter";
import { LoadingFallback } from "@/core/components/ui/fallback";
import { Label } from "@/core/components/ui/label";
import { Separator } from "@/core/components/ui/separator";
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
import { formatNumber } from "@/core/utils/formaters";
import { createColumnHelper } from "@tanstack/react-table";
import { CalendarCheck2Icon, RouteIcon } from "lucide-react";
import { allEventLogType, EventLog, getEventLogMeta } from "./constants";
import { eventLogSchema } from "./schema";

const createEventLogColumn = createColumnHelper<EventLog>();
const getEventLogColumns = (result?: {
  isLoading: boolean;
  count?: Record<string, number>;
}) => [
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
    header: (c) => (
      <ColumnHeader column={c.column} disabled={result?.isLoading}>
        Tipe Event
      </ColumnHeader>
    ),
    // cell: (c) => <UserRoleBadge value={c.cell.getValue()} />,
    cell: (c) => c.cell.getValue(),
    filterFn: filterFn("option"),
    meta: {
      label: "Tipe Event",
      type: "option",
      icon: RouteIcon,
      options: allEventLogType.map((value) => {
        const { displayName, icon } = getEventLogMeta(value);
        const count = result?.count?.[value];
        return { value, label: displayName, icon, count };
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
        mode="manual"
        query={{
          key,
          fetcher: async (state) => await fetcher.data(key, state, { schema }),
        }}
        columns={(result) => getEventLogColumns(result)}
        render={({ result, table }) => {
          const { data: res, isLoading } = result;

          const state = table.getState();
          const pageCount = table.getPageCount();

          return (
            <div className="flex flex-col gap-y-4">
              <div className="flex gap-x-2">
                <FilterSelector table={table} size="sm" disabled={isLoading} />
                <ResetFilters table={table} size="sm" disabled={isLoading} />
              </div>

              {state.columnFilters.length > 0 && (
                <ActiveFiltersContainer>
                  <ClearFilters table={table} size="icon-sm" />
                  <Separator orientation="vertical" className="h-4" />
                  <ActiveFilters table={table} />
                </ActiveFiltersContainer>
              )}

              {isLoading ? (
                <LoadingFallback />
              ) : res?.data.length ? (
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
                        style={
                          { "--timeline-color": color } as React.CSSProperties
                        }
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
              ) : (
                <div className="flex justify-center text-center">
                  <small>{messages.empty}</small>
                </div>
              )}

              <div className="flex w-full flex-col items-center gap-4 text-center lg:flex-row">
                <div className="order-3 flex shrink-0 items-center gap-x-2 lg:order-1 lg:mr-auto">
                  <Label>Data per halaman</Label>
                  <DataControllerPageSize
                    table={table}
                    size="sm"
                    disabled={isLoading}
                  />
                </div>

                <small className="order-1 shrink-0 tabular-nums lg:order-2">
                  Halaman{" "}
                  {isLoading
                    ? "?"
                    : formatNumber(state.pagination.pageIndex + 1)}{" "}
                  dari{" "}
                  {isLoading
                    ? "?"
                    : formatNumber(pageCount > 0 ? pageCount : 1)}
                </small>

                <DataControllerPaginationNav
                  table={table}
                  size="icon-sm"
                  className="order-2 shrink-0 lg:order-3"
                  disabled={isLoading}
                />
              </div>
            </div>
          );
        }}
      />
    </>
  );
}
