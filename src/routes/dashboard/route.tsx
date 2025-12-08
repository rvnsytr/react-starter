import { getRouteTitle } from "@/core/utils";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: (c) => {
    if (!c.context.session) throw redirect({ to: "/sign-in" });
    const { session, ...rest } = c.context;
    return { session, ...rest };
  },
  loader: (c) => c.context,
  head: () => ({ meta: [{ title: getRouteTitle("/dashboard") }] }),
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard"!</div>;
}
