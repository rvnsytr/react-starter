import { PageContainer } from "@/core/components/layout/page";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { getRouteTitle } from "@/core/route";
import { ProfileForm } from "@/modules/auth/components/profile-form";
import { RoleBadge } from "@/modules/auth/components/role-badge";
import { UserVerifiedBadge } from "@/modules/auth/components/user-verified-badge";
import { useSession } from "@/modules/auth/hooks/use-session";
import { appConfig } from "@/shared/config";
import { createFileRoute } from "@tanstack/react-router";
import { UserRoundIcon } from "lucide-react";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({ meta: [{ title: getRouteTitle("/dashboard/profile") }] }),
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useSession();

  return (
    <PageContainer className="items-center px-0">
      <Card id="informasi-pribadi" className="w-full lg:max-w-xl" asPageCard>
        <CardHeader className="border-b">
          <CardTitle>
            <UserRoundIcon /> Informasi Pribadi
          </CardTitle>
          <CardDescription>
            Perbarui dan kelola informasi profil <b>{appConfig.name}</b> Anda.
          </CardDescription>
          <CardAction className="flex flex-col items-end gap-2 md:flex-row-reverse">
            <RoleBadge value={user.role} />
            {user.emailVerified && <UserVerifiedBadge />}
          </CardAction>
        </CardHeader>

        <ProfileForm />
      </Card>
    </PageContainer>
  );
}
