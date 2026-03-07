import { mutateData } from "@/core/components/ui/data-controller";

export const mutateEventLog = () => mutateData("/event-log");
export const mutateEventLogMe = () => mutateData("/event-log/me");
