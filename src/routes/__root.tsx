import { NotFound } from "@/core/components/layout/not-found";
import { appMeta } from "@/core/constants/app";
import { getRouteTitle } from "@/core/route";
import { AuthSession } from "@/modules/auth/constants";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

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
      <Outlet />
      <Scripts />
      <TanStackRouterDevtools />
    </>
  );
}
