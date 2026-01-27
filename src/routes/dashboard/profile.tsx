import { DashboardMain } from "@/core/components/layout/dashboard";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { appMeta } from "@/core/constants/app";
import { getRouteTitle } from "@/core/route";
import {
  ProfileForm,
  UserRoleBadge,
  UserVerifiedBadge,
} from "@/modules/auth/components";
import { useAuth } from "@/modules/auth/provider.auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({ meta: [{ title: getRouteTitle("/dashboard/profile") }] }),
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();

  return (
    <DashboardMain className="items-center" noLayoutLoader>
      <Card id="informasi-pribadi" className="w-full scroll-m-20 lg:max-w-2xl">
        <CardHeader className="border-b">
          <CardTitle>Informasi Pribadi</CardTitle>
          <CardDescription>
            Perbarui dan kelola informasi profil {appMeta.name} Anda.
          </CardDescription>
          <CardAction className="flex flex-col items-end gap-2 md:flex-row-reverse">
            <UserRoleBadge value={user.role} />
            {user.emailVerified && <UserVerifiedBadge />}
          </CardAction>
        </CardHeader>

        <ProfileForm />
      </Card>
    </DashboardMain>
  );
}
