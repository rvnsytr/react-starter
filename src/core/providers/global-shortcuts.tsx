import { useEffect, useEffectEvent } from "react";
import { nextTheme, useTheme } from "../components/ui/theme";

export function GlobalShortcuts() {
  const { theme, setTheme } = useTheme();

  const onTheme = useEffectEvent(() => {
    const t = nextTheme(theme);
    setTheme(t);
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // ? Theme
      if (e.altKey && e.key === "t") {
        e.preventDefault();
        onTheme();
      }

      // more shortcuts here
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setTheme]);

  return null;
}
