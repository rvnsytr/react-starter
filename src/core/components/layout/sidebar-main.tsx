import { appMeta } from "@/core/constants/app";
import { dashboardfooterMenu } from "@/core/constants/menu";
import { getActiveRoute, getMenuByRole, routesMeta } from "@/core/route";
import { toCase } from "@/core/utils/formaters";
import {
  ImpersonateUserBadge,
  SignOutButton,
  StopImpersonateUserMenuItem,
  UserAvatar,
  UserVerifiedBadge,
} from "@/modules/auth/components";
import { useAuth } from "@/modules/auth/provider.auth";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronUpIcon } from "lucide-react";
import { useEffect, useEffectEvent, useMemo, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { CommandPalette } from "../ui/command-palette";
import { DynamicBreadcrumb } from "../ui/dynamic-breadcrumb";
import { LayoutToggle } from "../ui/layout";
import { Separator } from "../ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  SidebarToggle,
  useSidebar,
} from "../ui/sidebar";
import { ThemeToggle } from "../ui/theme";

export function SidebarMain() {
  const { user } = useAuth();
  const { isMobile, toggleSidebar } = useSidebar();

  const { pathname } = useLocation();

  const menu = useMemo(() => getMenuByRole(user.role), [user.role]);

  return (
    <Sidebar
      collapsible="icon"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
    >
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu className="flex lg:hidden">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="group/head-button h-13 group-data-[collapsible=icon]:my-2.5 group-data-[collapsible=icon]:p-0"
              asChild
            >
              <Link to="/dashboard/profile">
                <UserAvatar data={user} className="rounded-md" />

                <div className="grid break-all">
                  <div className="flex gap-x-2 truncate">
                    <span className="line-clamp-1 text-sm font-medium tracking-tight">
                      {user.name}
                    </span>

                    {user.emailVerified && (
                      <UserVerifiedBadge
                        classNames={{ icon: "size-3.5" }}
                        withText={false}
                      />
                    )}
                  </div>

                  <span className="text-muted-foreground line-clamp-1 text-xs">
                    {user.email}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator className="flex lg:hidden" />

        <CommandPalette data={menu} className="mt-2 lg:mt-0" />
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {menu.map(({ section, content }, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{section}</SidebarGroupLabel>

            <SidebarMenu>
              {content.map(({ route, icon: Icon, disabled, subMenu }) => {
                const { displayName } = routesMeta[route];

                const isActive = route === getActiveRoute(pathname);
                const iconElement = Icon && <Icon />;

                if (disabled) {
                  return (
                    <SidebarMenuItem key={route}>
                      <SidebarMenuButton disabled>
                        {iconElement}
                        <span className="line-clamp-1">{displayName}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMainContentCollapsible
                    key={route}
                    isActive={isActive}
                    asChild
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => isMobile && toggleSidebar()}
                        isActive={isActive}
                        tooltip={displayName}
                        asChild
                      >
                        <Link to={route}>
                          {iconElement}
                          <span className="line-clamp-1">{displayName}</span>
                        </Link>
                      </SidebarMenuButton>

                      {subMenu && (
                        <>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuAction className="*:transition-transform data-[state=open]:*:rotate-180">
                              <ChevronUpIcon />
                            </SidebarMenuAction>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {subMenu.map((itm, idx) => (
                                <SidebarMenuSubItem key={idx}>
                                  <SidebarMenuSubButton
                                    variant={itm.variant}
                                    className="flex justify-between"
                                    disabled={itm.disabled}
                                    asChild
                                  >
                                    <Link
                                      to={
                                        itm.href ??
                                        (`${route}/#${toCase(itm.displayName, "kebab")}` as string)
                                      }
                                      className="line-clamp-1"
                                    >
                                      {itm.displayName}
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      )}
                    </SidebarMenuItem>
                  </SidebarMainContentCollapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu className="gap-2">
          {dashboardfooterMenu.map(
            ({ route, displayName, icon: Icon, disabled }) => {
              const iconElement = Icon && <Icon />;
              return (
                <SidebarMenuItem key={route}>
                  {disabled ? (
                    <SidebarMenuButton size="sm" disabled>
                      {iconElement} {displayName}
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton size="sm" tooltip={displayName} asChild>
                      <Link to={route}>
                        {iconElement} {displayName}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              );
            },
          )}

          <SidebarSeparator />

          <StopImpersonateUserMenuItem />

          <SidebarMenuItem>
            <SignOutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export function SidebarMainSiteHeader() {
  const { user } = useAuth();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-x-2">
          <SidebarToggle align="start" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Link
            to="/dashboard"
            className="font-mono text-sm font-medium tracking-tight"
          >
            {appMeta.name}
          </Link>
        </div>

        <DynamicBreadcrumb className="hidden lg:flex" />

        <div className="flex items-center gap-x-2">
          <ImpersonateUserBadge />
          <LayoutToggle />
          <ThemeToggle align="end" />

          <Separator orientation="vertical" className="mr-2 h-4" />

          <Link to="/dashboard/profile">
            <UserAvatar data={user} className="rounded-md" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function SidebarMainContentCollapsible({
  isActive,
  ...props
}: React.ComponentProps<typeof Collapsible> & { isActive: boolean }) {
  const [isOpen, setIsOpen] = useState(isActive);

  const onActiveRoute = useEffectEvent(() => {
    if (isActive && !isOpen) setIsOpen(true);
  });

  useEffect(() => onActiveRoute, [isActive]);

  return <Collapsible open={isOpen} onOpenChange={setIsOpen} {...props} />;
}
