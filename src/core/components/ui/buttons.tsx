import { messages, Route } from "@/core/constants";
import { cn, delay } from "@/core/utils";
import { Link, useRouter } from "@tanstack/react-router";
import {
  ArrowUpIcon,
  CheckIcon,
  CopyIcon,
  RefreshCcwIcon,
  RotateCcwIcon,
} from "lucide-react";
import { useState } from "react";
import { Button, ButtonProps } from "./button";
import { LoadingSpinner } from "./spinner";

type ButtonIconSize = "icon-xs" | "icon-sm" | "icon" | "icon-lg";

export function ResetButton({
  type = "reset",
  size = "default",
  variant = "outline",
  ...props
}: Omit<ButtonProps, "children">) {
  return (
    <Button type={type} size={size} variant={variant} {...props}>
      <RotateCcwIcon /> {messages.actions.reset}
    </Button>
  );
}

export function PulsatingButton({
  href,
  className,
  children,
  pulseColor = "var(--primary-pulse)",
  duration = "1.5s",
  ...props
}: Omit<ButtonProps, "asChild"> & {
  href: Route;
  pulseColor?: string;
  duration?: string;
}) {
  return (
    <Button
      className={cn("relative rounded-full", className)}
      style={
        {
          "--pulse-color": pulseColor,
          "--duration": duration,
        } as React.CSSProperties
      }
      asChild
      {...props}
    >
      <Link to={href}>
        <div className="relative z-10 flex items-center gap-x-2">
          {children}
        </div>
        <div className="animate-button-pulse absolute top-1/2 left-1/2 size-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-inherit" />
      </Link>
    </Button>
  );
}

export function CopyButton({
  value,
  size = "icon",
  disabled,
  onClick,
  ...props
}: Omit<Omit<ButtonProps, "children">, "value" | "size"> & {
  value: string;
  size?: ButtonIconSize;
}) {
  const [copied, setCopied] = useState<boolean>(false);
  return (
    <Button
      size={size}
      disabled={copied || disabled}
      onClick={async (e) => {
        onClick?.(e);
        setCopied(true);
        navigator.clipboard.writeText(value);
        await delay(1);
        setCopied(false);
      }}
      {...props}
    >
      <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
      <CopyIcon
        className={cn("transition", copied ? "scale-0" : "scale-100")}
      />
      <CheckIcon
        className={cn("absolute transition", copied ? "scale-100" : "scale-0")}
      />
    </Button>
  );
}

export function RefreshButton({
  text = "Muat Ulang",
  disabled,
  onClick,
  ...props
}: Omit<ButtonProps, "children"> & { text?: string }) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  return (
    <Button
      disabled={refreshing || disabled}
      onClick={async (e) => {
        onClick?.(e);
        setRefreshing(true);
        await delay(0.5);
        router.invalidate();
        setRefreshing(false);
      }}
      {...props}
    >
      <LoadingSpinner
        variant="refresh"
        loading={refreshing}
        className="animate-reverse"
        icon={{ base: <RefreshCcwIcon /> }}
      />
      {text}
    </Button>
  );
}

export function ScrollToTopButton({
  size = "icon-lg",
  className,
  onClick,
  ...props
}: Omit<ButtonProps, "children">) {
  return (
    <Button
      size={size}
      className={cn(
        "fixed right-4 bottom-4 z-40 rounded-full lg:right-10 lg:bottom-8",
        className,
      )}
      onClick={(e) => {
        onClick?.(e);
        window.scrollTo(0, 0);
      }}
      {...props}
    >
      <ArrowUpIcon className="size-5" />
    </Button>
  );
}
