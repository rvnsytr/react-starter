import { getTitle } from "@/core/utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(home)/_layout/about")({
  head: () => ({ meta: [{ title: getTitle("/about") }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <code>/about</code>
    </div>
  );
}
