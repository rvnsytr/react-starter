import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/core/components/ui/empty";
import { Route } from "@/core/types";
import { Link } from "@tanstack/react-router";
import { GlobeXIcon } from "lucide-react";

export function NotFound({ to = "/" }: { to?: Route }) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <GlobeXIcon />
          </EmptyMedia>
          <EmptyTitle>404 - Not Found</EmptyTitle>
          <EmptyDescription>
            Oops, Looks like there&apos;s no one here.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link to={to} className="link">
            Take me Home
          </Link>
        </EmptyContent>
      </Empty>
    </div>
  );
}
