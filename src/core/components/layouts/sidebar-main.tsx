import { dashboardfooterMenu, routesMeta } from "@/core/constants";
import {
  cn,
  getActiveRoute,
  getMenuByRole,
  normalizeRoute,
  toKebabCase,
} from "@/core/utils";
import { SignOutButton, useAuth, UserAvatar } from "@/modules/auth";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
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
  sidebarMenuButtonVariants,
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

  const { pathname } = useLocation();
  const { isMobile, toggleSidebar } = useSidebar();

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
              {/* <Link to="/dashboard/profile"> */}
              <Link to="/dashboard">
                <UserAvatar
                  name={user.name}
                  image={user.image}
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
                  </div>

                  <span className="line-clamp-1 text-xs">{user.email}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {menu.map(({ section, content }, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{section}</SidebarGroupLabel>

            <SidebarMenu>
              {content.map(({ route, icon: Icon, disabled, subMenu }) => {
                const { displayName } = routesMeta[route];

                const normalizedPath = normalizeRoute(pathname);
                const isActive = route === getActiveRoute(normalizedPath);
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
                  <SidebarCollapsible key={route} isActive={isActive} asChild>
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
                              <ChevronRight />
                            </SidebarMenuAction>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {subMenu.map(({ label, href, variant }, idx) => (
                                <SidebarMenuSubItem key={idx}>
                                  <SidebarMenuSubButton
                                    variant={variant}
                                    className="flex justify-between"
                                    asChild
                                  >
                                    <Link
                                      to={
                                        href ??
                                        (`${route}/#${toKebabCase(label)}` as string)
                                      }
                                      className="line-clamp-1"
                                    >
                                      {label}
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      )}
                    </SidebarMenuItem>
                  </SidebarCollapsible>
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
                size="sm"
                variant="ghost"
                className={cn(
                  sidebarMenuButtonVariants({ size: "sm" }),
                  "justify-start",
                )}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>

          {dashboardfooterMenu.map(
            ({ url, displayName, icon: Icon, disabled }) => {
              const iconElement = Icon && <Icon />;
              return (
                <SidebarMenuItem key={url}>
                  {disabled ? (
                    <SidebarMenuButton size="sm" disabled>
                      {iconElement} {displayName}
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton size="sm" tooltip={displayName} asChild>
                      <Link to={url}>
                        {iconElement}
                        {displayName}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              );
            },
          )}

          <SidebarSeparator />

          <SidebarMenuItem>
            <SignOutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function SidebarCollapsible({
  isActive,
  ...props
}: ComponentProps<typeof CollapsiblePrimitive.Root> & {
  isActive: boolean;
}) {
  const [isOpen, setIsOpen] = useState(isActive);

  const onActiveRoute = useEffectEvent(() => setIsOpen(true));

  useEffect(() => {
    if (isActive) onActiveRoute();
  }, [isActive]);

  return <Collapsible open={isOpen} onOpenChange={setIsOpen} {...props} />;
}
