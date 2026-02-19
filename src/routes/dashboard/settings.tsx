import { DashboardMain } from "@/core/components/layout/dashboard";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Kbd, KbdGroup } from "@/core/components/ui/kbd";
import { LayoutSettings } from "@/core/components/ui/layout";
import { ThemeSettings } from "@/core/components/ui/theme";
import { appMeta } from "@/core/constants/app";
import { LAYOUT_TOGGLE_HOTKEY } from "@/core/providers/layout";
import { THEME_TOGGLE_HOTKEY } from "@/core/providers/theme";
import { getRouteTitle } from "@/core/route";
import {
  ChangePasswordForm,
  RevokeOtherSessionsButton,
  SessionList,
} from "@/modules/auth/components";
import { formatForDisplay } from "@tanstack/react-hotkeys";
import { createFileRoute } from "@tanstack/react-router";
import {
  FrameIcon,
  LockKeyholeIcon,
  ShieldIcon,
  SunMoonIcon,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: getRouteTitle("/dashboard/settings") }] }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardMain className="items-center" withLayoutLoader={false}>
      <Card id="tema" className="w-full scroll-m-20 lg:max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2">
            <SunMoonIcon /> Tema
          </CardTitle>
          <CardDescription>
            Sesuaikan tampilan dan nuansa{" "}
            <span className="text-foreground font-medium">{appMeta.name}</span>{" "}
            sesuai preferensi Anda.
          </CardDescription>

          <CardAction>
            <Kbd>{formatForDisplay(THEME_TOGGLE_HOTKEY)}</Kbd>
          </CardAction>
        </CardHeader>

        <CardContent>
          <ThemeSettings />
        </CardContent>
      </Card>

      <Card id="layout" className="w-full scroll-m-20 lg:max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2">
            <FrameIcon /> Layout
          </CardTitle>
          <CardDescription>
            Atur tata letak antarmuka{" "}
            <span className="text-foreground font-medium">{appMeta.name}</span>{" "}
            sesuai keinginan Anda.
          </CardDescription>
          <CardAction>
            <KbdGroup>
              <Kbd>{formatForDisplay(LAYOUT_TOGGLE_HOTKEY)}</Kbd>
            </KbdGroup>
          </CardAction>
        </CardHeader>

        <CardContent>
          <LayoutSettings />
        </CardContent>
      </Card>

      <Card id="sesi-aktif" className="w-full scroll-m-20 lg:max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2">
            <ShieldIcon /> Sesi Aktif
          </CardTitle>
          <CardDescription>
            Tinjau dan kelola sesi yang saat ini sedang masuk ke akun Anda.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SessionList />
        </CardContent>

        <CardFooter className="*:w-full *:lg:w-fit">
          <RevokeOtherSessionsButton />
        </CardFooter>
      </Card>

      <Card id="ubah-kata-sandi" className="w-full scroll-m-20 lg:max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2">
            <LockKeyholeIcon /> Ubah Kata Sandi
          </CardTitle>
          <CardDescription>
            Gunakan kata sandi yang kuat untuk menjaga keamanan akun Anda.
          </CardDescription>
        </CardHeader>

        <ChangePasswordForm />
      </Card>
    </DashboardMain>
  );
}
