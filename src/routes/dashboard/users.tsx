import { DashboardMain } from "@/core/components/layout/dashboard";
import { Button } from "@/core/components/ui/button";
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { Separator } from "@/core/components/ui/separator";
import { getRouteTitle } from "@/core/route";
import { dataTableQueryStateSchema } from "@/core/schema";
import { CreateUserDialog, UserDataTable } from "@/modules/auth/components";
import { createFileRoute } from "@tanstack/react-router";
import { EllipsisIcon } from "lucide-react";

// const t2Prefix = "t2-";

export const Route = createFileRoute("/dashboard/users")({
  // validateSearch: dataTableQueryStateSchema.extend(
  //   withSchemaPrefix(t2Prefix, dataTableQueryStateSchema).shape,
  // ),
  validateSearch: dataTableQueryStateSchema,
  head: () => ({ meta: [{ title: getRouteTitle("/dashboard/users") }] }),
  component: RouteComponent,
});

function RouteComponent() {
  const searchParam = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <DashboardMain>
      <CardHeader className="px-0">
        <CardTitle>Manajemen Pengguna</CardTitle>
        <CardDescription>
          Kelola dan lihat detail semua pengguna yang telah terdaftar.
        </CardDescription>

        <CardAction className="flex lg:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon-sm" variant="outline">
                <EllipsisIcon />
              </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="grid gap-y-1 p-1">
              <CreateUserDialog
                size="sm"
                variant="ghost"
                className="justify-start"
              />
            </PopoverContent>
          </Popover>
        </CardAction>

        <CardAction className="hidden lg:flex">
          <CreateUserDialog />
        </CardAction>
      </CardHeader>

      <Separator />

      <UserDataTable
        defaultState={searchParam}
        onStateChange={(search) =>
          navigate({
            search: (prev) => ({ ...prev, ...search }),
            replace: true,
          })
        }
      />

      {/* <OtherDataTable
        defaultState={Object.fromEntries(
          Object.entries(searchParam)
            .filter(([k]) => k.startsWith(t2Prefix))
            .map(([k, v]) => [k.replace(t2Prefix, ""), v]),
        )}
        onStateChange={(state) =>
          navigate({
            search: (prev) => ({
              ...prev,
              ...Object.fromEntries(
                Object.entries(state).map(([k, v]) => [`t2-${k}`, v]),
              ),
            }),
            replace: true,
          })
        }
      /> */}
    </DashboardMain>
  );
}
