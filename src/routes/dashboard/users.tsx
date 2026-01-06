import { DashboardMain } from "@/core/components/layout";
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Separator } from "@/core/components/ui/separator";
import { getRouteTitle } from "@/core/utils";
import { CreateUserDialog, UserDataTable } from "@/modules/auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/users")({
  head: () => ({ meta: [{ title: getRouteTitle("/dashboard/users") }] }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardMain className="pt-6">
      <CardHeader asPageHeader>
        <CardTitle>Manajemen Pengguna</CardTitle>
        <CardDescription>
          Kelola dan lihat detail semua pengguna yang telah terdaftar.
        </CardDescription>
        <CardAction asPageAction>
          <CreateUserDialog />
        </CardAction>
      </CardHeader>

      <Separator />

      <UserDataTable />
    </DashboardMain>
  );
}
