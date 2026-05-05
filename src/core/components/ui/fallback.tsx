import { cn } from "@/core/utils";
import { appConfig } from "@/shared/config/app";
import { TriangleAlertIcon } from "lucide-react";
import { motion } from "motion/react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Spinner, SpinnerProps } from "./spinner";

export function LoadingFallback({
  containerClassName,
  ...props
}: SpinnerProps & { containerClassName?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center p-4", containerClassName)}
    >
      <Spinner {...props} />
    </div>
  );
}

export function ErrorFallback({
  error,
  hideDesc = false,
  className,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  hideDesc?: boolean;
  className?: string;
}) {
  const message =
    error?.message ?? (typeof error === "string" ? error : "Tidak ada data");

  return (
    <Alert variant="destructive" className={className}>
      <TriangleAlertIcon />
      <AlertTitle>
        {`${appConfig.name} / `}
        <code className="bg-destructive/10 text-xs tabular-nums">
          {error?.code ?? 500}
        </code>
      </AlertTitle>

      {!hideDesc && (
        <AlertDescription>
          <pre className="whitespace-pre-wrap">{message}</pre>
        </AlertDescription>
      )}
    </Alert>
  );
}

export function AppLoadingFallback() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 2 }}
      className="container flex min-h-svh items-center justify-center"
    >
      <Spinner variant="orbit" className="size-8" />
    </motion.div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AppErrorFallback({ error }: { error?: any }) {
  return (
    <div className="container flex min-h-svh items-center justify-center">
      <ErrorFallback error={error} className="size-fit" />
    </div>
  );
}
