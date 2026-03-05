import { FooterNote } from "@/core/components/layout/footer-note";
import { NotFound } from "@/core/components/layout/not-found";
import {
  SidebarMain,
  SidebarMainSiteHeader,
} from "@/core/components/layout/sidebar-main";
import { SidebarInset, SidebarProvider } from "@/core/components/ui/sidebar";
import { BreadcrumbProvider } from "@/core/providers/breadcrumb";
import { LayoutProvider } from "@/core/providers/layout";
import { authorizedRoute, getRouteTitle, normalizeRoute } from "@/core/route";
import { useSession } from "@/modules/auth/hooks";
import { AuthProvider } from "@/modules/auth/provider.auth";
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
      <BreadcrumbProvider>
        <LayoutProvider>
          <div className="[--header-height:calc(--spacing(14))]">
            <SidebarProvider className="flex flex-col">
              <SidebarMainSiteHeader />

              <div className="flex flex-1">
                <SidebarMain />

                <SidebarInset>
                  <Outlet />
                  <footer className="bg-background/90 z-10 mt-auto flex items-center justify-center border-t py-4 text-center md:h-12.5">
                    <FooterNote className="container" />
                  </footer>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </div>
        </LayoutProvider>
      </BreadcrumbProvider>
    </AuthProvider>
  );
}
