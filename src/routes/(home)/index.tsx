import { Button } from "@/core/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(home)/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      {/* <code>/</code> */}

      <div className="flex flex-col items-center gap-y-2 *:flex *:items-center *:gap-x-2 **:capitalize">
        <div>
          <Button variant="default">default</Button>
          <Button variant="outline">outline</Button>
          <Button variant="ghost">ghost</Button>
          <Button variant="link">link</Button>
        </div>

        <div>
          <Button variant="success">success</Button>
          <Button variant="outline-success">outline-success</Button>
          <Button variant="ghost-success">ghost-success</Button>
        </div>

        <div>
          <Button variant="warning">warning</Button>
          <Button variant="outline-warning">outline-warning</Button>
          <Button variant="ghost-warning">ghost-warning</Button>
        </div>

        <div>
          <Button variant="destructive">destructive</Button>
          <Button variant="outline-destructive">outline-destructive</Button>
          <Button variant="ghost-destructive">ghost-destructive</Button>
        </div>
      </div>
    </div>
  );
}
