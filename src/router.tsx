import { createRouter, RouterProvider } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import z from "zod";
import { id } from "zod/locales";
import {
  AppErrorFallback,
  AppLoadingFallback,
} from "./core/components/ui/fallback";
import { GridPattern } from "./core/components/ui/grid-pattern";
import { Toaster } from "./core/components/ui/sonner";
import { GlobalShortcuts } from "./core/providers/global-shortcuts";
import { ThemeProvider } from "./core/providers/theme";
import { cn } from "./core/utils/helpers";
import { useSession } from "./modules/auth/hooks";
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
  const { data: session, isLoading, error } = useSession();

  if (error) return <AppErrorFallback error={error} />;
  const isInitialLoading = session === undefined && isLoading;

  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <AnimatePresence>
        {isInitialLoading && <AppLoadingFallback />}
      </AnimatePresence>

      {!isInitialLoading && (
        <RouterProvider router={router} context={{ session }} />
      )}

      <GridPattern
        className={cn(
          "stroke-muted dark:stroke-muted/60 -z-10 min-h-dvh",
          isInitialLoading && "mask-radial-from-60% dark:mask-radial-from-50%",
        )}
      />

      <Toaster position="top-center" closeButton richColors />

      <GlobalShortcuts />
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
