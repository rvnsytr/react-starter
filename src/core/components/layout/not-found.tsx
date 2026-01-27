import { Route } from "@/core/route";
import { Link } from "@tanstack/react-router";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "../ui/empty";

export function NotFound({ to = "/" }: { to?: Route }) {
  return (
    <Empty className="min-h-dvh">
      <EmptyHeader>
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
