import NotFound from "@/core/components/layouts/not-found";
import { appMeta } from "@/core/constants";
import { ThemeProvider } from "@/core/providers/theme";
import { getTitle } from "@/core/utils";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

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
        <Outlet />
      </ThemeProvider>
      <Scripts />
      <TanStackRouterDevtools />
    </>
  );
}
