import { Route } from "@/core/route";
import { Link } from "@tanstack/react-router";
import { GlobeXIcon } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";

export function NotFound({ to = "/" }: { to?: Route }) {
  return (
    <Empty className="min-h-svh">
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
  );
}
