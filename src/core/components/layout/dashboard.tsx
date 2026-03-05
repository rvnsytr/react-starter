import { cn } from "@/core/utils/helpers";
import { Spinner } from "../ui/spinner";

export function DashboardMain({
  withLayoutLoader = true,
  className,
  children,
}: {
  withLayoutLoader?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <Spinner
        data-slot="dashboard-main-loader"
        variant="frame"
        className={cn(
          "m-auto hidden size-5",
          !withLayoutLoader &&
            "group-data-[layout-mode=unset]/layout-mode:flex",
        )}
      />

      <div
        data-slot="dashboard-main"
        className={cn(
          "relative z-10 flex flex-1 flex-col gap-4 overflow-hidden py-4",
          "px-4 group-data-[layout-mode=centered]/layout-mode:container",
          !withLayoutLoader &&
            "group-data-[layout-mode=unset]/layout-mode:hidden",
          className,
        )}
      >
        {children}
      </div>
    </>
  );
}
