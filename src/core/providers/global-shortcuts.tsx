import { useHotkey } from "@tanstack/react-hotkeys";
import { nextTheme, THEME_TOGGLE_HOTKEY, useTheme } from "./theme";

export function GlobalShortcuts() {
  const { theme, setTheme } = useTheme();

  useHotkey(THEME_TOGGLE_HOTKEY, () => setTheme(nextTheme(theme)));

  return null;
}
