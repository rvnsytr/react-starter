import { getRouteTitle } from "@/core/utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(home)/_layout/about")({
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
