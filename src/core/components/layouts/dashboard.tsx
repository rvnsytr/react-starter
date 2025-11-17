import { useLayout } from "@/core/providers";
import { cn } from "@/core/utils";
import { ReactNode } from "react";
import { LayoutButton, ThemeButton } from "../ui/buttons";
import {
  DynamicBreadcrumb,
  DynamicBreadcrumbProps,
} from "../ui/dynamic-breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { Spinner } from "../ui/spinner";

export function DashboardMain({
  className,
  children,
  ...props
}: DynamicBreadcrumbProps & { className?: string; children?: ReactNode }) {
  const { layout } = useLayout();

  return (
    <>
      <nav className="bg-background/90 sticky top-0 z-50 flex items-center justify-between gap-x-4 border-b p-4 shadow-xs backdrop-blur-xs">
        <div className="flex items-center gap-x-2">
          <SidebarTrigger align="start" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <DynamicBreadcrumb {...props} />
        </div>

        <div className="flex items-center gap-x-2">
          <LayoutButton />
          <ThemeButton align="end" />
        </div>
      </nav>

      {layout ? (
        <div
          className={cn(
            "relative z-10 flex flex-1 flex-col gap-4 py-4",
            layout === "fullwidth" ? "px-4" : "container",
            className,
          )}
        >
          {children}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center p-4">
          <Spinner variant="frame" className="size-5" />
        </div>
      )}
      {children}
    </>
  );
}
