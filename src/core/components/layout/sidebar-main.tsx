import { dashboardfooterMenu, routesMeta } from "@/core/constants";
import { getActiveRoute, getMenuByRole, toKebab } from "@/core/utils";
import {
  SignOutButton,
  StopImpersonateUserMenuItem,
  useAuth,
  UserAvatar,
  UserVerifiedBadge,
} from "@/modules/auth";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import {
  ComponentProps,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from "react";
import { RefreshButton } from "../ui/buttons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { CommandPalette } from "../ui/command-palette";
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
  useSidebar,
} from "../ui/sidebar";

export function SidebarMain() {
  const { user } = useAuth();
  const { isMobile, toggleSidebar } = useSidebar();

  const { pathname } = useLocation();

  const menu = useMemo(() => getMenuByRole(user.role), [user.role]);

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="group/head-button h-13 group-data-[collapsible=icon]:my-2.5 group-data-[collapsible=icon]:p-0"
              asChild
            >
              <Link to="/dashboard/profile">
                <UserAvatar
                  data={user}
                  className="rounded-md"
                  classNames={{
                    image: "rounded-md group-hover/head-button:scale-105",
                    fallback: "rounded-md group-hover/head-button:scale-105",
                  }}
                />

                <div className="grid break-all">
                  <div className="flex items-center gap-x-2">
                    <span className="line-clamp-1 text-sm font-semibold">
                      {user.name}
                    </span>
                    {user.emailVerified && (
                      <UserVerifiedBadge
                        classNames={{ icon: "size-3.5" }}
                        noText
                      />
                    )}
                  </div>

                  <span className="line-clamp-1 text-xs">{user.email}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator className="mb-2" />

        <CommandPalette data={menu} />
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
                            <SidebarMenuAction className="data-[state=open]:rotate-90">
                              <ChevronRightIcon />
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
                                        (`${route}/#${toKebab(itm.displayName)}` as string)
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
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Refresh Page" asChild>
              <RefreshButton
                size="xs"
                variant="ghost"
                className="justify-start text-xs"
              />
            </SidebarMenuButton>
          </SidebarMenuItem>

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

function SidebarMainContentCollapsible({
  isActive,
  ...props
}: ComponentProps<typeof Collapsible> & { isActive: boolean }) {
  const [isOpen, setIsOpen] = useState(isActive);

  const onActiveRoute = useEffectEvent(() => {
    if (isActive && !isOpen) setIsOpen(true);
  });

  useEffect(() => onActiveRoute, [isActive]);

  return <Collapsible open={isOpen} onOpenChange={setIsOpen} {...props} />;
}
