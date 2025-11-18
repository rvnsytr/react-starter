"use client";

import { useEffect, useEffectEvent } from "react";
import { useTheme } from "./theme";

export function GlobalShortcuts() {
  const { theme, setTheme } = useTheme();

  const onTheme = useEffectEvent(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Theme
      if (e.altKey && e.key === "t") {
        e.preventDefault();
        onTheme();
      }

      // more shortcuts here
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return null;
}
