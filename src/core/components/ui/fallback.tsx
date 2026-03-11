import { appMeta } from "@/core/constants/app";
import { cn } from "@/core/utils/helpers";
import { LoaderIcon, TriangleAlertIcon } from "lucide-react";
import { motion } from "motion/react";
import { Separator } from "./separator";
import { ShimmerText } from "./shimmer-text";
import { Spinner } from "./spinner";
import { ThemeToggle } from "./theme";

export function LoadingFallback({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <LoaderIcon className="text-foreground size-4 animate-spin" />
    </div>
  );
}

export function ErrorFallback({
  error,
  hideText = false,
  className,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  hideText?: boolean;
  className?: string;
}) {
  const message =
    error?.message ?? (typeof error === "string" ? error : "Tidak ada data");
  return (
    <div
      className={cn(
        "bg-destructive/10 shadow-destructive text-destructive flex size-full flex-col items-center gap-4 rounded-md p-4 text-sm",
        className,
      )}
    >
      <div className="flex w-full items-center justify-between gap-x-12">
        <div className="flex items-center gap-x-2 font-medium">
          <TriangleAlertIcon className="size-4 shrink-0" /> {appMeta.name}
        </div>

        <code className="bg-destructive/10 text-xs tabular-nums">
          {error?.code ?? 500}
        </code>
      </div>

      <Separator className="bg-destructive/20" />

      {!hideText && (
        <div className="flex size-full items-center justify-center">
          <pre>{message}</pre>
        </div>
      )}
    </div>
  );
}

export function AppLoadingFallback() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 2 }}
      className="relative container flex min-h-svh flex-col items-center justify-center gap-y-8"
    >
      <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-end">
        <img
          src={appMeta.logo.withText}
          alt="Logo Bukit Asam Purnaku"
          width={1200}
          height={800}
          loading="eager"
          className="h-12 w-full lg:h-16 lg:w-auto"
        />

        <ShimmerText className="text-2xl font-extrabold lg:text-4xl">
          PURNAKU
        </ShimmerText>
      </div>

      <Spinner variant="orbit" className="size-5" />

      <ThemeToggle
        size="lg"
        variant="outline"
        className="fixed right-6 bottom-6 rounded-full lg:right-10 lg:bottom-8"
        align="end"
      />
    </motion.div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AppErrorFallback({ error }: { error?: any }) {
  return (
    <div className="container flex min-h-dvh flex-col items-center justify-center gap-y-8">
      <img
        src={appMeta.logo.withText}
        alt="Logo Bukit Asam Purnaku"
        width={1200}
        height={800}
        loading="eager"
        className="h-auto w-40"
      />
      <ErrorFallback error={error} className="size-fit" />
    </div>
  );
}
