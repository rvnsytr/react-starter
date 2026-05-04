"use client";

import { useHotkeys } from "@tanstack/react-hotkeys";
import { THEME_TOGGLE_HOTKEY } from "../components/theme";
import { useViewTransition } from "../hooks/use-view-transition";
import { nextTheme, useTheme } from "./theme";

export function GlobalShortcuts() {
  const { theme, setTheme } = useTheme();
  const { isTransitioning, startTransition } = useViewTransition();

  useHotkeys(
    [
      {
        hotkey: THEME_TOGGLE_HOTKEY,
        callback: () => startTransition(() => setTheme(nextTheme(theme))),
      },
    ],
    { enabled: !isTransitioning },
  );

  return null;
}
