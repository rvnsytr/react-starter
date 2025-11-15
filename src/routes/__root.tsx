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
      <div className="flex gap-2 p-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <Scripts />
      <TanStackRouterDevtools />
    </>
  ),
});
