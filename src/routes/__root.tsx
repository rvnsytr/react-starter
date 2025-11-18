import NotFound from "@/core/components/layouts/not-found";
import { GridPattern } from "@/core/components/ui/grid-pattern";
import { appMeta } from "@/core/constants";
import { GlobalShortcuts } from "@/core/providers/global-shortcuts";
import { ThemeProvider } from "@/core/providers/theme";
import { getTitle } from "@/core/utils";
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
      { title: getTitle("/") },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
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
