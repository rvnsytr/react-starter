import { ThemeButton } from "@/core/components/ui/buttons";
import { R } from "@/core/components/ui/motion";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(home)/_layout")({
  component: HomeLayout,
});

function HomeLayout() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-y-4">
      <R />

      <p>React Starter</p>

      <div className="flex items-center gap-x-2">
        <Link to="/" className="link [&.active]:font-semibold">
          Home
        </Link>

        <Link to="/about" className="link [&.active]:font-semibold">
          About
        </Link>
      </div>

      <Outlet />

      <ThemeButton />
    </main>
  );
}
