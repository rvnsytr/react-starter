import { FooterNote } from "@/core/components/layout/footer-note";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import { appMeta } from "@/core/constants/app";
import { getRouteTitle } from "@/core/route";
import { SignInForm, SignUpForm } from "@/modules/auth/components";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-in")({
  beforeLoad: (c) => {
    if (c.context.session) throw redirect({ to: "/dashboard" });
  },
  head: () => ({ meta: [{ title: getRouteTitle("/sign-in") }] }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="container flex min-h-dvh items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="border-b text-center">
          <CardTitle className="mx-auto">
            <Link to="/">
              <h3>{appMeta.name}</h3>
            </Link>
          </CardTitle>
          <CardDescription>
            Masuk ke Dashboard {appMeta.name} dengan aman menggunakan akun Anda.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="masuk">
            <TabsList className="w-full">
              <TabsTrigger value="masuk">Masuk</TabsTrigger>
              <TabsTrigger value="daftar">Daftar</TabsTrigger>
            </TabsList>

            <TabsContent value="masuk">
              <SignInForm />
            </TabsContent>
            <TabsContent value="daftar">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="justify-center border-t text-center">
          <FooterNote />
        </CardFooter>
      </Card>
    </main>
  );
}
