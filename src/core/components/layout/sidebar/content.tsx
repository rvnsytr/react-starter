"use client";

import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/core/components/ui/collapsible";
import { Kbd } from "@/core/components/ui/kbd";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/core/components/ui/sidebar";
import { LinkSpinner } from "@/core/components/ui/spinner";
import { getActiveRoute, getMenuByRole } from "@/core/route";
import { toCase } from "@/core/utils";
import { useSession } from "@/modules/auth/hooks/use-session";
import { menuConfig } from "@/shared/menu";
import { routesConfig } from "@/shared/route";
import { formatForDisplay } from "@tanstack/react-hotkeys";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import {
  ComponentProps,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from "react";

export function SidebarAppContent() {
  const { user } = useSession();
  const { isMobile, toggleSidebar } = useSidebar();

  const { pathname } = useLocation();

  const menu = useMemo(
    () => getMenuByRole(menuConfig.dashboard, user.role),
    [user.role],
  );

  const activeRoute = getActiveRoute(menu, pathname);

  return (
    <SidebarContent>
      {menu.map(({ group, items }, index) => (
        <SidebarGroup key={index}>
          <SidebarGroupLabel>{group}</SidebarGroupLabel>

          <SidebarMenu>
            {items.map(
              ({ route, icon: Icon, disabled, shortcut, subItems }) => {
                const { label } = routesConfig[route];

                const isActive = route === activeRoute;
                const iconElement = Icon && <Icon />;

                if (disabled) {
                  return (
                    <SidebarMenuItem key={route}>
                      <SidebarMenuButton disabled>
                        {iconElement}
                        <span className="line-clamp-1">{label}</span>
                        {shortcut && (
                          <Kbd className="ml-auto hidden lg:inline-flex">
                            {formatForDisplay(shortcut)}
                          </Kbd>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMainContentCollapsible
                    key={route}
                    isActive={isActive}
                    render={<SidebarMenuItem />}
                  >
                    <SidebarMenuButton
                      onClick={() => isMobile && toggleSidebar()}
                      isActive={isActive}
                      tooltip={label}
                      render={<Link to={route} />}
                    >
                      <LinkSpinner icon={{ base: iconElement }} />
                      <span className="line-clamp-1">{label}</span>
                      {shortcut && (
                        <Kbd className="ml-auto hidden lg:inline-flex">
                          {formatForDisplay(shortcut)}
                        </Kbd>
                      )}
                    </SidebarMenuButton>

                    {subItems && (
                      <>
                        <CollapsibleTrigger
                          render={
                            <SidebarMenuAction className="data-panel-open:rotate-90">
                              <ChevronRightIcon />
                            </SidebarMenuAction>
                          }
                        />

                        <CollapsiblePanel>
                          <SidebarMenuSub>
                            {subItems.map((itm, idx) => (
                              <SidebarMenuSubItem key={idx}>
                                <SidebarMenuSubButton
                                  className="flex justify-between"
                                  render={
                                    <Link
                                      to={
                                        itm.href ??
                                        `${route}#${toCase(itm.label, "kebab")}`
                                      }
                                    >
                                      <span className="line-clamp-1">
                                        {itm.label}
                                      </span>
                                      <LinkSpinner />
                                    </Link>
                                  }
                                />
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsiblePanel>
                      </>
                    )}
                  </SidebarMainContentCollapsible>
                );
              },
            )}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </SidebarContent>
  );
}

function SidebarMainContentCollapsible({
  isActive,
  ...props
}: ComponentProps<typeof Collapsible> & { isActive: boolean }) {
  const [isOpen, setIsOpen] = useState(isActive);

  const onActiveRoute = useEffectEvent(() => {
    if (isActive && !isOpen) setIsOpen(true);
  });

  useEffect(() => onActiveRoute(), [isActive]);

  return <Collapsible open={isOpen} onOpenChange={setIsOpen} {...props} />;
}
