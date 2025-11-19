import { Route, routesMeta } from "@/core/constants";
import { useIsMobile } from "@/core/hooks";
import { Link } from "@tanstack/react-router";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

type DynamicBreadcrumbContent = { to: Route; label: string };
type DynamicBreadcrumbData = Route | DynamicBreadcrumbContent;
export type DynamicBreadcrumbProps = {
  breadcrumb?: DynamicBreadcrumbData[];
  currentPage: string;
};

function getProps(data: DynamicBreadcrumbData): DynamicBreadcrumbContent {
  return typeof data === "string"
    ? { to: data, label: routesMeta[data].displayName }
    : data;
}

export function DynamicBreadcrumb({
  breadcrumb,
  currentPage,
  className,
}: DynamicBreadcrumbProps & { className?: string }) {
  const isMobile = useIsMobile();
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {breadcrumb?.map((item, index) => {
          const { to, label } = getProps(item);
          if (isMobile && index !== 0) return;

          return (
            <Fragment key={to}>
              <BreadcrumbItem className="shrink-0">
                <BreadcrumbLink asChild>
                  <Link to={to} className="link">
                    {label}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </Fragment>
          );
        })}

        {breadcrumb && breadcrumb.length > 2 && (
          <>
            <BreadcrumbItem className="mx-0.5 md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <BreadcrumbEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {breadcrumb?.map((item, index) => {
                    const { to, label } = getProps(item);
                    if (isMobile && index === 0) return;

                    return (
                      <DropdownMenuItem key={to} asChild>
                        <Link to={to}>{label}</Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="md:hidden">/</BreadcrumbSeparator>
          </>
        )}

        <BreadcrumbItem>
          <BreadcrumbPage className="line-clamp-1 cursor-default text-ellipsis">
            {currentPage}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
