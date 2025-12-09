import { FooterNote, SidebarMain } from "@/core/components/layouts";
import { SidebarInset, SidebarProvider } from "@/core/components/ui/sidebar";
import { LayoutProvider } from "@/core/providers";
import { getRouteTitle } from "@/core/utils";
import { AuthProvider } from "@/modules/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: (c) => {
    if (!c.context.session) throw redirect({ to: "/sign-in" });
    const { session, ...rest } = c.context;
    return { session, ...rest };
  },
  loader: (c) => c.context,
  head: () => ({ meta: [{ title: getRouteTitle("/dashboard") }] }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const { session } = Route.useLoaderData();

  return (
    <AuthProvider session={session}>
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
