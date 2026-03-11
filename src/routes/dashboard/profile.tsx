import { Page, PageCard } from "@/core/components/layout/page";
import {
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
import { UserRoundIcon } from "lucide-react";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({ meta: [{ title: getRouteTitle("/dashboard/profile") }] }),
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();

  return (
    <Page className="items-center px-0 md:px-4" withLayoutLoader={false}>
      <PageCard
        id="informasi-pribadi"
        className="w-full scroll-m-20 lg:max-w-2xl"
      >
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-x-2">
            <UserRoundIcon /> Informasi Pribadi
          </CardTitle>
          <CardDescription>
            Perbarui dan kelola informasi profil {appMeta.name} Anda.
          </CardDescription>
          <CardAction className="flex flex-col items-end gap-2 md:flex-row-reverse">
            <UserRoleBadge value={user.role} />
            {user.emailVerified && <UserVerifiedBadge />}
          </CardAction>
        </CardHeader>

        <ProfileForm />
      </PageCard>
    </Page>
  );
}
