"use client";

import { nextTheme, themeConfig } from "@/shared/config";
import { formatForDisplay, Hotkey } from "@tanstack/react-hotkeys";
import { ComponentProps } from "react";
import { useIsMobile } from "../hooks/use-media-query";
import { useViewTransition } from "../hooks/use-view-transition";
import { useTheme } from "../providers/theme";
import { Button, ButtonProps } from "./ui/button";
import { Kbd } from "./ui/kbd";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Tooltip, TooltipPopup, TooltipTrigger } from "./ui/tooltip";

export const themeToggleConfig: {
  label: string;
  hotkey: Hotkey;
  hotkeyDisplay: string;
} = {
  label: "Toggle Theme",
  hotkey: "D",
  get hotkeyDisplay() {
    return formatForDisplay(this.hotkey);
  },
};

export function ThemeToggle({
  withTooltip = true,
  align,
  size = "icon",
  variant = "ghost",
  onClick,
  className,
  disabled = false,
  ...props
}: Omit<ButtonProps, "children"> &
  Pick<ComponentProps<typeof TooltipPopup>, "align"> & {
    withTooltip?: boolean;
  }) {
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  const { isTransitioning, startTransition } = useViewTransition();

  const currentTheme = theme ?? "system";
  const { icon: Icon } = themeConfig[currentTheme];

  const element = (
    <Button
      size={size}
      variant={variant}
      onClick={(e) => {
        onClick?.(e);
        startTransition(() => setTheme(nextTheme(theme)));
      }}
      className={className}
      disabled={disabled || isTransitioning}
      {...props}
    >
      <Icon />
      <span className="sr-only">{themeToggleConfig.label}</span>
    </Button>
  );

  if (isMobile || !withTooltip) return element;

  return (
    <Tooltip>
      <TooltipTrigger render={element} />
      <TooltipPopup align={align}>
        <div className="flex items-center gap-x-1">
          {themeToggleConfig.label} <Kbd>{themeToggleConfig.hotkeyDisplay}</Kbd>
        </div>
      </TooltipPopup>
    </Tooltip>
  );
}

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const { isTransitioning, startTransition } = useViewTransition();

  return (
    <RadioGroup
      value={theme}
      defaultValue="system"
      onValueChange={(v) => startTransition(() => setTheme(v))}
      className="grid grid-cols-3"
      disabled={isTransitioning}
    >
      {Object.entries(themeConfig).map(([k, { icon: Icon }]) => (
        <Label key={k} className="justify-center capitalize" asCard>
          <RadioGroupItem value={k} hidden />
          <Icon /> {k}
        </Label>
      ))}
    </RadioGroup>
  );
}
