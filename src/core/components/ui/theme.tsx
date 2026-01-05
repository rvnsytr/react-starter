import { LucideIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Button, ButtonProps } from "./button";
import { Field, FieldContent, FieldLabel, FieldTitle } from "./field";
import { Kbd, KbdGroup } from "./kbd";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export const allThemes = ["light", "system", "dark"] as const;
export type Theme = (typeof allThemes)[number];

export const themeMeta: Record<Theme, { icon: LucideIcon }> = {
  light: { icon: SunIcon },
  system: { icon: MonitorIcon },
  dark: { icon: MoonIcon },
};

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeProviderContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};

export function nextTheme(currentTheme?: Theme) {
  if (currentTheme === "light") return "dark";
  if (currentTheme === "dark") return "system";
  return "light";
}

export function ThemeToggle({
  align,
  size = "icon",
  variant = "ghost",
  onClick,
  ...props
}: Omit<ButtonProps, "children"> &
  Pick<ComponentProps<typeof TooltipContent>, "align">) {
  const { theme, setTheme } = useTheme();

  const currentTheme = (theme ?? "system") as Theme;
  const { icon: Icon } = themeMeta[currentTheme];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size={size}
          variant={variant}
          onClick={(e) => {
            onClick?.(e);
            const t = nextTheme(theme);
            setTheme(t);
          }}
          {...props}
        >
          <Icon />
          <span className="sr-only">Toggle Theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent
        align={align}
        className="flex flex-col items-center gap-2"
      >
        <span>Toggle Theme</span>
        <KbdGroup>
          <Kbd>Alt</Kbd>
          <span>+</span>
          <Kbd>T</Kbd>
        </KbdGroup>
      </TooltipContent>
    </Tooltip>
  );
}

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  return (
    <RadioGroup
      value={theme}
      defaultValue="system"
      onValueChange={setTheme}
      className="grid grid-cols-3"
      required
    >
      {Object.entries(themeMeta).map(([k, { icon: Icon }]) => (
        <FieldLabel key={k} htmlFor={`rd-theme-${k}`}>
          <Field>
            <FieldContent className="items-center">
              <FieldTitle className="flex-col capitalize md:flex-row">
                <Icon /> {k}
              </FieldTitle>
            </FieldContent>
            <RadioGroupItem id={`rd-theme-${k}`} value={k} hidden />
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  );
}
