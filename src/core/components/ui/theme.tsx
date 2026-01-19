import { useIsMobile } from "@/core/hooks";
import { nextTheme, Theme, themeMeta, useTheme } from "@/core/providers/theme";
import { ComponentProps } from "react";
import { Button, ButtonProps } from "./button";
import { Field, FieldContent, FieldLabel, FieldTitle } from "./field";
import { Kbd, KbdGroup } from "./kbd";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export function ThemeToggle({
  align,
  size = "icon",
  variant = "ghost",
  onClick,
  ...props
}: Omit<ButtonProps, "children"> &
  Pick<ComponentProps<typeof TooltipContent>, "align">) {
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();

  const currentTheme = (theme ?? "system") as Theme;
  const { icon: Icon } = themeMeta[currentTheme];

  const element = (
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
  );

  if (isMobile) return element;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{element}</TooltipTrigger>
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
