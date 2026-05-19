import {
  DataControllerPageSize,
  DataControllerPaginationNav,
} from "@/core/components/data-controller";
import {
  ActiveFilters,
  ActiveFiltersContainer,
  ClearFilters,
  FilterSelector,
  ResetFilters,
} from "@/core/components/filters";
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
import { fetcher } from "@/core/fetcher";
import {
  DataControllerOptions,
  DataControllerResponse,
  mutateControlledData,
  useDataController,
} from "@/core/hooks/use-data-controller";
import { messages } from "@/core/messages";
import { formatLocalizedDate, formatNumber } from "@/core/utils";
import { cn } from "@/core/utils/helpers";
import { ErrorFallback, LoadingFallback } from "@/shared/components/fallback";
import { getActivityTypeConfig } from "../config";
import { activityKeys } from "../config/keys";
import { activityTableWithEntitySchema, ActivityWithEntity } from "../schema";
import { getActivityColumns } from "./activity-column";

export type ActivityTimelineProps = {
  className?: string;
};

function BaseActivityTimeline({
  className,
  controller: { result, table },
}: ActivityTimelineProps & {
  controller: DataControllerResponse<ActivityWithEntity>;
}) {
  if (result.error) return <ErrorFallback error={result.error} />;

  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      <div className="flex gap-x-2">
        <FilterSelector table={table} size="sm" />
        <ResetFilters table={table} size="sm" />
      </div>

      {table.getState().columnFilters.length > 0 && (
        <ActiveFiltersContainer>
          <ClearFilters table={table} size="icon-sm" />
          <Separator orientation="vertical" className="h-4" />
          <ActiveFilters table={table} />
        </ActiveFiltersContainer>
      )}

      {result.isLoading ? (
        <LoadingFallback variant="frame" />
      ) : table.getRowModel().rows.length ? (
        <Timeline orientation="vertical" className="px-2">
          {table.getRowModel().rows.map((row, index) => {
            const {
              label,
              description,
              icon: Icon,
              color,
            } = getActivityTypeConfig(row.original.type, row.original);

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
                    {formatLocalizedDate(row.original.created_at, "PPPp")}
                  </TimelineDate>

                  <TimelineTitle className="text-(--timeline-color)">
                    {label}
                  </TimelineTitle>
                </TimelineHeader>
                <TimelineContent>{description}</TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      ) : (
        <div className="flex justify-center py-4 text-center">
          <small>{messages.empty}</small>
        </div>
      )}

      <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
        <div
          data-slot="pagination"
          className="order-3 flex items-center gap-x-2 lg:order-1"
        >
          <Label className="hidden shrink-0 lg:inline-flex">Per halaman</Label>
          <DataControllerPageSize table={table} size="sm" />
        </div>

        <small
          data-slot="page-info"
          className="order-1 shrink-0 tabular-nums lg:order-2"
        >
          Halaman{" "}
          {result.isLoading
            ? "?"
            : formatNumber(table.getState().pagination.pageIndex + 1)}{" "}
          dari{" "}
          {result.isLoading
            ? "?"
            : formatNumber(table.getPageCount() > 0 ? table.getPageCount() : 1)}
        </small>

        <DataControllerPaginationNav
          data-slot="pagination-nav"
          table={table}
          size="icon-sm"
          className="order-2 lg:order-3"
        />
      </div>
    </div>
  );
}

const controllerOptions: Omit<
  DataControllerOptions<ActivityWithEntity>,
  "query"
> = {
  mode: "auto",
  columns: getActivityColumns,
  getRowId: (row) => row.id,
  defaultState: { pagination: { pageIndex: 0, pageSize: 5 } },
};

const fetcherSchema = activityTableWithEntitySchema.array();

export const mutateUserActivityTimeline = (userId: string) =>
  mutateControlledData(activityKeys.getByUser(userId));

export function UserActivityTimeline({
  userId,
  ...props
}: ActivityTimelineProps & { userId: string }) {
  const key = activityKeys.getByUser(userId);

  const controller = useDataController({
    ...controllerOptions,
    query: {
      key,
      fetcher: async (state) =>
        await fetcher.api(key, {
          method: "POST",
          body: JSON.stringify(state),
          schema: fetcherSchema,
        }),
    },
  });

  return <BaseActivityTimeline controller={controller} {...props} />;
}

// TODO: function ProfileActivityTimeline() {}
