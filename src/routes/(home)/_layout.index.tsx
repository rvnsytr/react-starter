import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(home)/_layout/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <code>/</code>
    </div>
  );
}
