import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/core/components/ui/empty";
import { Link } from "@tanstack/react-router";

export default function NotFound() {
  return (
    <Empty className="min-h-dvh">
      <EmptyHeader>
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>
          Oops, Looks like there&apos;s no one here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link to="/" className="link">
          Take me Home
        </Link>
      </EmptyContent>
    </Empty>
  );
}
