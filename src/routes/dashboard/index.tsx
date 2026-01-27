import { DashboardMain } from "@/core/components/layout/dashboard";
import { R } from "@/core/components/ui/r";
import { useAuth } from "@/modules/auth/provider.auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const authSession = useAuth();

  return (
    <DashboardMain className="items-center justify-center">
      <R />
      <pre className="container">{JSON.stringify(authSession, null, 2)}</pre>
    </DashboardMain>
  );
}
