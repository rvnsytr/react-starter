import { FooterNote } from "@/core/components/layout/footer-note";
import { NotFound } from "@/core/components/layout/not-found";
import {
  SidebarApp,
  SidebarAppSiteHeader,
} from "@/core/components/layout/sidebar";
import { SidebarInset, SidebarProvider } from "@/core/components/ui/sidebar";
import { DynamicBreadcrumbProvider } from "@/core/providers/dynamic-breadcrumb";
import { LayoutModeProvider } from "@/core/providers/layout-mode";
import { authorizedRoute, getRouteTitle, normalizeRoute } from "@/core/route";
import { getClientCookie } from "@/core/utils";
import { useSessionQuery } from "@/modules/auth/hooks/use-session";
import { AuthProvider } from "@/modules/auth/provider";
import { allLayoutMode } from "@/shared/config";
import {
  createFileRoute,
  notFound,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: (c) => {
    const { session, ...rest } = c.context;
    if (!session) throw redirect({ to: "/sign-in" });

    const pathname = normalizeRoute(c.location.pathname);
    const isAuthorized = authorizedRoute(pathname, session.user.role);

    const layoutPreference = z
      .enum(allLayoutMode)
      .catch("centered")
      .parse(getClientCookie("layout-preference"));

    return { isAuthorized, session, layoutPreference, ...rest };
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
  const { data: session } = useSessionQuery({ fallbackData: loader.session });

  return (
    <AuthProvider session={session ?? loader.session}>
      <LayoutModeProvider
        layout={loader.layoutPreference}
        className="[--header-height:calc(--spacing(12))] lg:[--header-height:calc(--spacing(14))]"
      >
        <SidebarProvider className="flex flex-col">
          <DynamicBreadcrumbProvider>
            <SidebarAppSiteHeader />

            <div className="flex flex-1">
              <SidebarApp />

              <SidebarInset>
                <Outlet />
                <footer className="bg-background/90 z-10 mt-auto flex items-center justify-center border-t py-4 text-center md:h-12.5">
                  <FooterNote className="container" />
                </footer>
              </SidebarInset>
            </div>
          </DynamicBreadcrumbProvider>
        </SidebarProvider>
      </LayoutModeProvider>
    </AuthProvider>
  );
}
