import { getRouteTitle } from "@/core/route";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(home)/about")({
  head: () => ({ meta: [{ title: getRouteTitle("/about") }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <code>/about</code>
    </div>
  );
}
