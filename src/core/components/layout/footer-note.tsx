import { cn } from "@/core/utils/helpers";
import { Link } from "@tanstack/react-router";

export function FooterNote({ className }: { className?: string }) {
  return (
    <small className={cn("text-muted-foreground", className)}>
      {"Built by "}
      <Link
        to={"https://github.com/RvnSytR" as string}
        target="_blank"
        className="link-underline"
      >
        RvnS
      </Link>
      {" under heavy caffeine influence."}
    </small>
  );
}
