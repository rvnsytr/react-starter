"use client";

import { useHotkeys } from "@tanstack/react-hotkeys";
import { themeToggleConfig } from "../components/theme";
import { useViewTransition } from "../hooks/use-view-transition";
import { nextTheme, useTheme } from "./theme";

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
