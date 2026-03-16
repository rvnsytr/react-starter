import { useIsMobile } from "@/core/hooks/use-is-mobile";
import {
  LAYOUT_TOGGLE_HOTKEY,
  LayoutMode,
  layoutModeMeta,
  useLayout,
} from "@/core/providers/layout";
import { cn } from "@/core/utils/helpers";
import { formatForDisplay, useHotkey } from "@tanstack/react-hotkeys";
import { Button, ButtonProps } from "./button";
import { Field, FieldContent, FieldLabel, FieldTitle } from "./field";
import { Kbd } from "./kbd";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export function LayoutToggle({
  align,
  size = "icon-sm",
  variant = "ghost",
  onClick,
  className,
  disabled,
  ...props
}: Omit<ButtonProps, "children"> &
  Pick<React.ComponentProps<typeof TooltipContent>, "align">) {
  const isMobile = useIsMobile();
  const { layout, setLayout } = useLayout();

  const { icon: Icon } = layoutModeMeta[layout];

  const toggleLayout = () =>
    setLayout((prev) => (prev === "fullwidth" ? "centered" : "fullwidth"));

  useHotkey(LAYOUT_TOGGLE_HOTKEY, toggleLayout);

  const element = (
    <Button
      size={size}
      variant={variant}
      onClick={(e) => {
        onClick?.(e);
        toggleLayout();
      }}
      className={cn("hidden 2xl:inline-flex", className)}
      disabled={disabled ?? layout === "unset"}
      {...props}
    >
      <Icon />
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
        <span>Toggle Layout</span>
        <Kbd>{formatForDisplay(LAYOUT_TOGGLE_HOTKEY)}</Kbd>
      </TooltipContent>
    </Tooltip>
  );
}

export function LayoutSettings() {
  const { layout, setLayout } = useLayout();

  return (
    <RadioGroup
      value={layout}
      defaultValue="default"
      onValueChange={(v) => setLayout(v as LayoutMode)}
      className="grid grid-cols-2"
      required
    >
      {Object.entries(layoutModeMeta)
        .filter(([k]) => k !== "unset")
        .map(([k, { displayName, icon: Icon }]) => (
          <FieldLabel key={k} htmlFor={`rd-theme-${k}`}>
            <Field>
              <FieldContent className="items-center">
                <FieldTitle className="flex-col md:flex-row">
                  <Icon /> {displayName}
                </FieldTitle>
              </FieldContent>
              <RadioGroupItem id={`rd-theme-${k}`} value={k} hidden />
            </Field>
          </FieldLabel>
        ))}
    </RadioGroup>
  );
}
