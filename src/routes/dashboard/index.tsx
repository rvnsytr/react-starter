import { DashboardMain } from "@/core/components/layout/dashboard";
import { FieldLegend } from "@/core/components/ui/field";
import { R } from "@/core/components/ui/r";
import { Separator } from "@/core/components/ui/separator";
import { useAuth } from "@/modules/auth/provider.auth";
import { EventLogTimeline } from "@/modules/event-log/components";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const authSession = useAuth();

  return (
    <DashboardMain>
      <R className="mx-auto my-4" />

      <Separator />

      <FieldLegend>Event Log</FieldLegend>
      <EventLogTimeline url="/event-log/me" />

      <Separator />

      <FieldLegend>Session Example</FieldLegend>
      <pre className="container">{JSON.stringify(authSession, null, 2)}</pre>
    </DashboardMain>
  );
}
