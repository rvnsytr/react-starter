import {
  ActiveFilters,
  ActiveFiltersContainer,
  ClearFilters,
  FilterSelector,
  ResetFilters,
} from "@/core/components/filters";
import { LoadingFallback } from "@/core/components/ui/fallback";
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
  DataControllerState,
  useDataController,
} from "@/core/hooks/use-data-controller";
import { messages } from "@/core/messages";
import { formatLocalizedDate } from "@/core/utils";
import { cn } from "@/core/utils/helpers";
import { getActivityConfig } from "../config";
import { ACTIVITY_KEYS } from "../config/keys";
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
  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      <div className="flex gap-x-2">
        <FilterSelector table={table} size="sm" disabled={result.isLoading} />
        <ResetFilters table={table} size="sm" disabled={result.isLoading} />
      </div>

      {table.getState().columnFilters.length > 0 && (
        <ActiveFiltersContainer>
          <ClearFilters table={table} size="icon-sm" />
          <Separator orientation="vertical" className="h-4" />
          <ActiveFilters table={table} />
        </ActiveFiltersContainer>
      )}

      {result.isLoading ? (
        <LoadingFallback />
      ) : result.data?.success && result.data.data.length ? (
        <Timeline orientation="vertical" className="px-2">
          {result.data.data.map((item, index) => {
            const {
              label,
              description,
              icon: Icon,
              color,
            } = getActivityConfig(item.type, item);

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
                    {formatLocalizedDate(item.created_at, "PPPp")}
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
    </div>
  );
}

const controllerOptions: Omit<
  DataControllerOptions<ActivityWithEntity>,
  "query"
> = {
  mode: "auto",
  columns: (ctx) => {
    const isLoading = ctx?.isLoading ?? false;
    const count = ctx?.data?.count;
    return getActivityColumns({ isLoading, count });
  },
  getRowId: (row) => row.id,
  defaultState: { pagination: { pageIndex: 0, pageSize: 5 } },
};

export function UserActivityTimeline({
  userId,
  ...props
}: ActivityTimelineProps & { userId: string }) {
  const key = ACTIVITY_KEYS.get(userId);
  const schema = activityTableWithEntitySchema.array();

  const queryFetcher = async (state: DataControllerState) => {
    const body = JSON.stringify(state);
    return await fetcher.api(key, { schema, body });
  };

  const controller = useDataController({
    ...controllerOptions,
    query: { key, fetcher: queryFetcher },
  });

  return <BaseActivityTimeline controller={controller} {...props} />;
}
