import { ThemeProvider } from "@/core/providers/theme";
import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { name: "name", content: "React Starter" },
      { name: "description", content: "App description..." },
      { title: "React Starter" },
    ],
  }),
  component: () => (
    <>
      <HeadContent />

      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <main className="flex min-h-dvh flex-col items-center justify-center gap-y-4">
          <Link to="/" className="[&.active]:font-semibold">
            Home
          </Link>

          <Link to="/about" className="[&.active]:font-semibold">
            About
          </Link>

          <Outlet />
        </main>
      </ThemeProvider>

      <Scripts />
      <TanStackRouterDevtools />
    </>
  ),
});
