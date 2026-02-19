import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/core/components/ui/command";
import { Menu } from "@/core/constants/menu";
import { messages } from "@/core/constants/messages";
import { routesMeta } from "@/core/route";
import { toCase } from "@/core/utils/formaters";
import { cn } from "@/core/utils/helpers";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useNavigate } from "@tanstack/react-router";
import { DotIcon, SearchIcon } from "lucide-react";
import { Fragment, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { Kbd } from "./kbd";
import { LoadingSpinner } from "./spinner";

type CommandPalleteProps = {
  data: Menu[];
  className?: string;
  placeholder?: string;
};

export function CommandPalette({
  data,
  className,
  placeholder: plch,
}: CommandPalleteProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const onOpen = () => setIsOpen((prev) => !prev);

  useHotkey("Control+K", onOpen);
  useHotkey("Meta+K", onOpen);

  const placeholder = plch ?? "Pencarian cepat...";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <InputGroup className="**:cursor-default group-data-[collapsible=icon]:size-8">
          <InputGroupInput
            placeholder={placeholder}
            className={cn("disabled:opacity-100", className)}
            disabled
          />

          <InputGroupAddon
            align="inline-start"
            className="group-data-[collapsible=icon]:px-1.5"
          >
            <LoadingSpinner
              loading={isPending}
              icon={{ base: <SearchIcon /> }}
            />
          </InputGroupAddon>

          <InputGroupAddon
            align="inline-end"
            className="group-data-[collapsible=icon]:hidden"
          >
            <Kbd>⌘+K</Kbd>
          </InputGroupAddon>
        </InputGroup>
      </DialogTrigger>

      <DialogContent className="p-1" showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle>Command Pallete</DialogTitle>
          <DialogDescription>Command Menu Pallete</DialogDescription>
        </DialogHeader>

        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{messages.empty}</CommandEmpty>

            {data.map((item, index) => (
              <Fragment key={item.section}>
                {index !== 0 && <CommandSeparator />}

                <CommandGroup heading={item.section}>
                  {item.content.map(
                    ({ route, icon: Icon, disabled, subMenu }) => {
                      const meta = routesMeta[route];
                      const onSelectHandler = (to: string) => {
                        startTransition(() => navigate({ to }));
                        setIsOpen(false);
                      };

                      return (
                        <Fragment key={route}>
                          <CommandItem
                            disabled={disabled}
                            onSelect={() => onSelectHandler(route)}
                          >
                            {Icon && <Icon />} {meta.displayName}
                          </CommandItem>

                          {!disabled &&
                            subMenu?.map((itm) => {
                              const isDestructive =
                                itm.variant === "destructive";
                              const href = `${route}/#${toCase(itm.displayName, "kebab")}`;
                              return (
                                <CommandItem
                                  key={href}
                                  disabled={itm.disabled}
                                  onSelect={() => onSelectHandler(href)}
                                  className={cn(
                                    isDestructive &&
                                      "text-destructive data-selected:bg-destructive/10 data-selected:text-destructive",
                                  )}
                                >
                                  <DotIcon
                                    className={cn(
                                      isDestructive && "text-destructive",
                                    )}
                                  />
                                  {itm.displayName}
                                </CommandItem>
                              );
                            })}
                        </Fragment>
                      );
                    },
                  )}
                </CommandGroup>
              </Fragment>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
