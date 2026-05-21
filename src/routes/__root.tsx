import { AuthSession } from "@/core/auth";
import { NotFound } from "@/core/components/layout/not-found";
import { getRouteTitle } from "@/core/route";
import { appConfig } from "@/shared/config";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";

type RouterContext = { session: AuthSession | null };

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { name: "name", content: appConfig.name },
      { name: "description", content: appConfig.description },
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
      <Outlet />
      <Scripts />
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}
