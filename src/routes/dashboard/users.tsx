import { DashboardMain } from "@/core/components/layout";
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
import { getRouteTitle } from "@/core/utils";
import { CreateUserDialog, UserDataTable } from "@/modules/auth";
import { createFileRoute } from "@tanstack/react-router";
import { EllipsisIcon } from "lucide-react";

export const Route = createFileRoute("/dashboard/users")({
  head: () => ({ meta: [{ title: getRouteTitle("/dashboard/users") }] }),
  component: RouteComponent,
});

function RouteComponent() {
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

      <UserDataTable />
    </DashboardMain>
  );
}
