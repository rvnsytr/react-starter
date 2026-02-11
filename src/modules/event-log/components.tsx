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
import { formatDate } from "@/core/utils/date";
import { EventLog, eventLogMeta } from "./constants";

export function EventLogTimeline({ data }: { data: EventLog[] }) {
  if (!data.length)
    return (
      <div className="flex justify-center text-center">
        <small>{messages.empty}</small>
      </div>
    );

  return (
    <Timeline orientation="vertical" className="px-2">
      {data.map((item, index) => {
        const meta = eventLogMeta[item.type];
        const {
          displayName,
          desc,
          icon: Icon,
          color,
        } = typeof meta === "function" ? meta(item.data) : meta;

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

              <TimelineDate>{formatDate(item.createdAt, "PPPp")}</TimelineDate>

              <TimelineTitle className="text-(--timeline-color)">
                {displayName}
              </TimelineTitle>
            </TimelineHeader>
            <TimelineContent>{desc}</TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
