import { FooterNote, NotFound, SidebarMain } from "@/core/components/layout";
import { SidebarInset, SidebarProvider } from "@/core/components/ui/sidebar";
import { LayoutProvider } from "@/core/providers";
import { authorizedRoute, getRouteTitle, normalizeRoute } from "@/core/utils";
import { AuthProvider, useSession } from "@/modules/auth";
import {
  createFileRoute,
  notFound,
  Outlet,
  redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: (c) => {
    const { session, ...rest } = c.context;
    if (!session) throw redirect({ to: "/sign-in" });

    const pathname = normalizeRoute(c.location.pathname);
    const isAuthorized = authorizedRoute(pathname, session.user.role);

    return { isAuthorized, session, ...rest };
  },
  loader: (c) => {
    if (!c.context.isAuthorized) throw notFound();
    return c.context;
  },
  head: () => ({ meta: [{ title: getRouteTitle("/dashboard") }] }),
  component: DashboardLayout,
  notFoundComponent: () => <NotFound to="/dashboard" />,
});

function DashboardLayout() {
  const loader = Route.useLoaderData();
  const { data: session } = useSession({ fallbackData: loader.session });

  return (
    <AuthProvider session={session ?? loader.session}>
      <SidebarProvider>
        <SidebarMain />

        <SidebarInset>
          <LayoutProvider>
            <Outlet />
          </LayoutProvider>
          <footer className="bg-background/90 z-10 mt-auto flex items-center justify-center border-t py-4 text-center md:h-12.5">
            <FooterNote className="container" />
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
