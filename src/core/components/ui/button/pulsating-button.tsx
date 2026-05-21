import { Route } from "@/core/types";
import { cn } from "@/core/utils";
import { Link } from "@tanstack/react-router";
import { Button, ButtonProps } from "./button";

export function PulsatingButton({
  href,
  className,
  children,
  pulseColor = "var(--primary-pulse)",
  duration = "1.5s",
  ...props
}: ButtonProps & {
  href: Route;
  pulseColor?: string;
  duration?: string;
}) {
  return (
    <Button
      data-slot="pulsating-button"
      style={
        {
          "--pulse-color": pulseColor,
          "--duration": duration,
        } as React.CSSProperties
      }
      className={cn("relative rounded-full", className)}
      render={
        <Link to={href}>
          <div className="relative z-10 flex items-center gap-x-2">
            {children}
          </div>
          <div className="animate-button-pulse absolute top-1/2 left-1/2 size-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-inherit" />
        </Link>
      }
      {...props}
    />
  );
}
