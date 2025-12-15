import { createRouter, RouterProvider } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import {
  AppErrorFallback,
  AppLoadingFallback,
} from "./core/components/ui/fallback";
import { ThemeProvider } from "./core/providers";
import { useSession } from "./modules/auth";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
  trailingSlash: "never",
  context: { session: null, imageId: null },
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
        <RouterProvider
          router={router}
          context={{ session, imageId: session?.imageId }}
        />
      )}
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
