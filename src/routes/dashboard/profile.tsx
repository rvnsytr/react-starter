import { DashboardMain } from "@/core/components/layouts";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { appMeta } from "@/core/constants";
import { getRouteTitle } from "@/core/utils";
import {
  ProfileForm,
  Role,
  useAuth,
  UserRoleBadge,
  UserVerifiedBadge,
} from "@/modules/auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({ meta: [{ title: getRouteTitle("/dashboard/profile") }] }),
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();

  return (
    <DashboardMain className="items-center">
      <Card id="informasi-pribadi" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader className="border-b">
          <CardTitle>Informasi Pribadi</CardTitle>
          <CardDescription>
            Perbarui dan kelola informasi profil {appMeta.name} Anda.
          </CardDescription>
          <CardAction className="flex flex-col items-end gap-2 md:flex-row-reverse">
            <UserRoleBadge value={user.role as Role} />
            {user.emailVerified && <UserVerifiedBadge />}
          </CardAction>
        </CardHeader>

        <ProfileForm />
      </Card>
    </DashboardMain>
  );
}
