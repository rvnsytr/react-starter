import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(home)/about")({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <code>/about</code>
    </div>
  );
}
