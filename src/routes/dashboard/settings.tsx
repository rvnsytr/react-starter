import { DashboardMain } from "@/core/components/layouts";
import { LayoutSettings, ThemeSettings } from "@/core/components/ui/buttons";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Kbd, KbdGroup } from "@/core/components/ui/kbd";
import { appMeta } from "@/core/constants";
import { getRouteTitle } from "@/core/utils";
import { ChangePasswordForm } from "@/modules/auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: getRouteTitle("/dashboard/settings") }] }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardMain className="items-center">
      <Card id="tema" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader className="border-b">
          <CardTitle>Tema</CardTitle>
          <CardDescription>
            Sesuaikan tampilan dan nuansa{" "}
            <span className="text-foreground font-medium">{appMeta.name}</span>{" "}
            sesuai preferensi Anda.
          </CardDescription>

          <CardAction>
            <KbdGroup>
              <Kbd>Alt</Kbd>
              <span className="font-light">+</span>
              <Kbd>T</Kbd>
            </KbdGroup>
          </CardAction>
        </CardHeader>

        <CardContent>
          <ThemeSettings />
        </CardContent>
      </Card>

      <Card id="layout" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader className="border-b">
          <CardTitle>Layout</CardTitle>
          <CardDescription>
            Atur tata letak antarmuka{" "}
            <span className="text-foreground font-medium">{appMeta.name}</span>{" "}
            sesuai keinginan Anda.
          </CardDescription>
          <CardAction>
            <KbdGroup>
              <Kbd>Alt</Kbd>
              <span className="font-light">+</span>
              <Kbd>L</Kbd>
            </KbdGroup>
          </CardAction>
        </CardHeader>

        <CardContent>
          <LayoutSettings />
        </CardContent>
      </Card>

      <Card id="ubah-kata-sandi" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader className="border-b">
          <CardTitle>Ubah Kata Sandi</CardTitle>
          <CardDescription>
            Gunakan kata sandi yang kuat untuk menjaga keamanan akun Anda.
          </CardDescription>
        </CardHeader>

        <ChangePasswordForm />
      </Card>
    </DashboardMain>
  );
}
