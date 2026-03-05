import { getRouteHierarchy, normalizeRoute, routesMeta } from "@/core/route";
import { Link, useLocation } from "@tanstack/react-router";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

// type DynamicBreadcrumbContent = { href: Route; label: string };
// type DynamicBreadcrumbData = Route | DynamicBreadcrumbContent;

export function DynamicBreadcrumb({ className }: { className?: string }) {
  const { pathname } = useLocation();

  const breadcrumbs = getRouteHierarchy(normalizeRoute(pathname)).map((r) => {
    const meta = routesMeta[r];
    return typeof r === "string" ? { href: r, label: meta.displayName } : r;
  });

  const withDropdown = breadcrumbs.length > 3;
  const lastPart = breadcrumbs[breadcrumbs.length - 1];

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>

        {breadcrumbs.length > 1 &&
          breadcrumbs.map((br, i) => {
            if (
              (withDropdown && i > 0) ||
              (!withDropdown && (i > 1 || i === breadcrumbs.length - 1))
            )
              return;

            return (
              <Fragment key={br.href}>
                <BreadcrumbItem className="shrink-0">
                  <BreadcrumbLink asChild>
                    <Link to={br.href} className="link">
                      {br.label}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator>/</BreadcrumbSeparator>
              </Fragment>
            );
          })}

        {withDropdown && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon-xs" variant="ghost">
                    <BreadcrumbEllipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {breadcrumbs.map((br, i) => {
                    if ([0, breadcrumbs.length - 1].includes(i)) return;
                    return (
                      <DropdownMenuItem key={br.href} className="h-7" asChild>
                        <Link to={br.href}>{br.label}</Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>

            <BreadcrumbSeparator>/</BreadcrumbSeparator>
          </>
        )}

        <BreadcrumbItem>
          <BreadcrumbPage>{lastPart.label}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
