import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/core/components/ui/tabs";
import { getRouteTitle } from "@/core/route";
import { SignInForm } from "@/modules/auth/components/sign-in-form";
import { SignUpForm } from "@/modules/auth/components/sign-up-form";
import { FooterNote } from "@/shared/components/footer-note";
import { appConfig } from "@/shared/config";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { LogInIcon, UserRoundPlusIcon } from "lucide-react";
import z from "zod";

export const Route = createFileRoute("/sign-in")({
  validateSearch: z.object({ callbackURL: z.string().optional() }),
  beforeLoad: (c) => {
    if (c.context.session) throw redirect({ to: "/dashboard" });
  },
  head: () => ({ meta: [{ title: getRouteTitle("/sign-in") }] }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Card className="w-full max-w-lg" asPageCard>
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-lg font-semibold">
            <Link to="/">{appConfig.name}</Link>
          </CardTitle>
          <CardDescription>
            Masuk ke Dashboard {appConfig.name} dengan aman menggunakan akun
            Anda.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-y-4">
          <Tabs defaultValue="sign-in">
            <TabsList className="w-full">
              <TabsTab value="sign-in">
                <LogInIcon /> Masuk
              </TabsTab>
              <TabsTab value="sign-up">
                <UserRoundPlusIcon /> Daftar
              </TabsTab>
            </TabsList>

            <TabsPanel value="sign-in">
              <SignInForm />
            </TabsPanel>
            <TabsPanel value="sign-up">
              <SignUpForm />
            </TabsPanel>
          </Tabs>
        </CardContent>

        <CardFooter className="justify-center text-center">
          <FooterNote />
        </CardFooter>
      </Card>
    </div>
  );
}
