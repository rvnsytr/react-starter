import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/core/components/ui/alert";
import { Spinner, SpinnerProps } from "@/core/components/ui/spinner";
import { cn } from "@/core/utils";
import { appConfig } from "@/shared/config";
import { TriangleAlertIcon } from "lucide-react";
import { motion } from "motion/react";

export type LoadingFallback = SpinnerProps & { containerClassName?: string };

export function LoadingFallback({
  containerClassName,
  ...props
}: LoadingFallback) {
  return (
    <div
      className={cn("flex items-center justify-center p-4", containerClassName)}
    >
      <Spinner {...props} />
    </div>
  );
}

export type ErrorFallbackProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  hideDescription?: boolean;
  hideError?: boolean;
  className?: string;
};

export function ErrorFallback({
  error,
  hideDescription = false,
  hideError = false,
  className,
}: ErrorFallbackProps) {
  let errorData = error;
  let errorMessage =
    error?.message ?? (typeof error === "string" ? error : "Tidak ada data");

  if (error instanceof Error) {
    const { name, message, stack, cause } = error;
    errorData = { ...error, name, message, stack, cause };
    errorMessage = `${name}: ${message}`;
  }

  return (
    <Alert variant="destructive" className={className}>
      <TriangleAlertIcon />
      <AlertTitle>
        {`${appConfig.name} / `}
        <code className="bg-destructive/10 text-xs tabular-nums">
          {errorData?.code ?? 500}
        </code>
      </AlertTitle>

      {!(hideDescription && hideError) && (
        <AlertDescription>
          {!hideDescription && errorMessage}
          {!hideError && (
            <pre className="text-xs">{JSON.stringify(errorData, null, 2)}</pre>
          )}
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

export function AppErrorFallback({ className, ...props }: ErrorFallbackProps) {
  return (
    <div className="container flex min-h-svh items-center justify-center">
      <ErrorFallback className={cn(className, "size-fit")} {...props} />
    </div>
  );
}
