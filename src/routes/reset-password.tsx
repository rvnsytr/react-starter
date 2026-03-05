import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { appMeta } from "@/core/constants/app";
import { getRouteTitle } from "@/core/route";
import { ResetPasswordForm } from "@/modules/auth/components";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search?.token ?? null) as string | null,
  }),
  beforeLoad: ({ search: { token } }) => {
    if (!token) throw redirect({ to: "/sign-in" });
    return { token };
  },
  loader: (c) => c.context,
  head: () => ({ meta: [{ title: getRouteTitle("/reset-password") }] }),
  component: RouteComponent,
});

function RouteComponent() {
  const { token } = Route.useRouteContext();
  return (
    <main className="flex min-h-dvh items-center justify-center md:container">
      <Card className="animate-fade w-full max-w-lg rounded-none md:rounded-lg">
        <CardHeader className="border-b text-center">
          <CardTitle className="mx-auto">
            <Link to="/">
              <h3>{appMeta.name}</h3>
            </Link>
          </CardTitle>
          <CardDescription>
            Atur ulang kata sandi Anda dengan memasukkan kata sandi baru di
            bawah ini.
          </CardDescription>
        </CardHeader>
        <ResetPasswordForm token={token} />
      </Card>
    </main>
  );
}
