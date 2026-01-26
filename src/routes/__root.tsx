import { NotFound } from "@/core/components/layout";
import { GridPattern } from "@/core/components/ui/grid-pattern";
import { appMeta } from "@/core/constants";
import { GlobalShortcuts } from "@/core/providers/global-shortcuts";
import { getRouteTitle } from "@/core/utils";
import { AuthSession } from "@/modules/auth";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";

type RouterContext = { session: AuthSession | null };

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { name: "name", content: appMeta.name },
      { name: "description", content: appMeta.description },
      { title: getRouteTitle("/") },
    ],
  }),
  component: RootLayout,
  notFoundComponent: () => <NotFound />,
});

function RootLayout() {
  return (
    <>
      <HeadContent />

      <GridPattern className="stroke-muted dark:stroke-muted/60 -z-10 min-h-dvh" />

      <Outlet />

      <Toaster position="top-center" closeButton richColors />

      <GlobalShortcuts />

      <Scripts />

      <TanStackRouterDevtools />
    </>
  );
}
