import {
  AppErrorFallback,
  AppLoadingFallback,
} from "@/shared/components/fallback";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import z from "zod";
import { id } from "zod/locales";
import { GridPattern } from "./core/components/ui/grid-pattern";
import {
  AnchoredToastProvider,
  ToastProvider,
} from "./core/components/ui/toast";
import { GlobalShortcuts } from "./core/providers/global-shortcuts";
import { ThemeProvider } from "./core/providers/theme";
import { cn } from "./core/utils";
import { useSessionQuery } from "./modules/auth/hooks/use-session";
import { routeTree } from "./routeTree.gen";

z.config(id());

const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
  trailingSlash: "never",
  context: { session: null },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const { data: session, isLoading, error } = useSessionQuery();

  if (error) return <AppErrorFallback error={error} />;
  const isInitialLoading = session === undefined && isLoading;

  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <ToastProvider>
        <AnchoredToastProvider>
          <main className="relative isolate flex min-h-svh flex-col">
            <AnimatePresence>
              {isInitialLoading && <AppLoadingFallback />}
            </AnimatePresence>

            {!isInitialLoading && (
              <RouterProvider router={router} context={{ session }} />
            )}

            <GridPattern
              className={cn(
                "stroke-muted/60 dark:stroke-muted/20",
                isInitialLoading &&
                  "mask-radial-from-60% dark:mask-radial-from-50%",
              )}
            />
          </main>

          <GlobalShortcuts />
        </AnchoredToastProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
