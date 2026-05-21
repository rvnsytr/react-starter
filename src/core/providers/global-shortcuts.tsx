"use client";

import { nextTheme, themeToggleConfig } from "@/shared/config";
import { useHotkeys } from "@tanstack/react-hotkeys";
import { useViewTransition } from "../hooks/use-view-transition";
import { useTheme } from "./theme";

export function GlobalShortcuts() {
  const { theme, setTheme } = useTheme();
  const { isTransitioning, startTransition } = useViewTransition();

  useHotkeys(
    [
      {
        hotkey: themeToggleConfig.hotkey,
        callback: () => startTransition(() => setTheme(nextTheme(theme))),
      },
    ],
    { enabled: !isTransitioning },
  );

  return null;
}
