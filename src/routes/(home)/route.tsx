import { R } from "@/core/components/ui/r";
import { ThemeToggle } from "@/core/components/ui/theme";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(home)")({
  component: HomeLayout,
});

function HomeLayout() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-y-4">
      <R />

      <p>React Starter</p>

      <Link to="/sign-in">Sign In</Link>

      <div className="flex items-center gap-x-2">
        <Link to="/" className="link [&.active]:font-semibold">
          Home
        </Link>

        <Link to="/about" className="link [&.active]:font-semibold">
          About
        </Link>
      </div>

      <Outlet />

      <ThemeToggle />
    </main>
  );
}
