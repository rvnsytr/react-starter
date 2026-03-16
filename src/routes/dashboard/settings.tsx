import { Page, PageCard } from "@/core/components/layout/page";
import {
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Kbd } from "@/core/components/ui/kbd";
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
    <Page className="items-center px-0 md:px-4" withLayoutLoader={false}>
      <PageCard id="tema" className="w-full lg:max-w-2xl">
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
      </PageCard>

      <PageCard id="layout" className="w-full lg:max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2">
            <FrameIcon /> Layout
          </CardTitle>
          <CardDescription>
            Sesuaikan tata letak antarmuka{" "}
            <span className="text-foreground font-medium">{appMeta.name}</span>{" "}
            sesuai preferensi Anda. Perubahan ini berlaku pada layar dengan
            lebar lebih dari 1024px.
          </CardDescription>
          <CardAction>
            <Kbd>{formatForDisplay(LAYOUT_TOGGLE_HOTKEY)}</Kbd>
          </CardAction>
        </CardHeader>

        <CardContent>
          <LayoutSettings />
        </CardContent>
      </PageCard>

      <PageCard id="sesi-aktif" className="w-full lg:max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2">
            <ShieldIcon /> Sesi Aktif
          </CardTitle>
          <CardDescription>
            Lihat dan kelola sesi yang saat ini sedang aktif pada akun Anda.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SessionList />
        </CardContent>

        <CardFooter className="*:w-full *:lg:w-fit">
          <RevokeOtherSessionsButton />
        </CardFooter>
      </PageCard>

      <PageCard id="ubah-kata-sandi" className="w-full lg:max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2">
            <LockKeyholeIcon /> Ganti Kata Sandi
          </CardTitle>
          <CardDescription>
            Gunakan kata sandi yang kuat untuk menjaga keamanan akun Anda.
          </CardDescription>
        </CardHeader>

        <ChangePasswordForm />
      </PageCard>
    </Page>
  );
}
