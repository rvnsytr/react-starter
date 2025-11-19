import { NotFound } from "@/core/components/layouts";
import { GridPattern } from "@/core/components/ui/grid-pattern";
import { appMeta } from "@/core/constants";
import { GlobalShortcuts } from "@/core/providers/global-shortcuts";
import { ThemeProvider } from "@/core/providers/theme";
import { getRouteTitle } from "@/core/utils";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { name: "name", content: appMeta.name },
      { name: "description", content: appMeta.description },
      { title: getRouteTitle("/") },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => <NotFound className="min-h-dvh" />,
});

function RootComponent() {
  return (
    <>
      <HeadContent />

      <ThemeProvider defaultTheme="system" storageKey="theme">
        <GridPattern className="stroke-muted dark:stroke-muted/60 -z-1 min-h-dvh" />
        <Outlet />
        <Toaster position="top-center" closeButton richColors />
        <GlobalShortcuts />
      </ThemeProvider>

      <Scripts />

      <TanStackRouterDevtools />
    </>
  );
}
