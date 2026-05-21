import { authClient } from "@/core/auth";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { getRouteTitle } from "@/core/route";
import { AppLoadingFallback } from "@/shared/components/fallback";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/verify-user")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search?.token ?? null) as string | null,
  }),
  head: () => ({ meta: [{ title: getRouteTitle("/verify-user") }] }),
  loader: async ({ location }) => {
    const token = new URLSearchParams(location.search).get("token");

    if (!token) {
      toast.add({
        type: "error",
        title: "Token tidak ditemukan",
        description: "Token verifikasi tidak ditemukan. Silakan coba lagi.",
      });

      throw redirect({ to: "/sign-in" });
    }

    await toast.promise(
      authClient.verifyEmail({ query: { token } }).then((res) => {
        if (res.error) throw res.error;
        return res.data;
      }),
      {
        loading: { title: messages.loading },
        success: () => ({
          title: "Verifikasi Berhasil",
          description: "Silakan masuk untuk melanjutkan.",
        }),
        error: (e) => ({
          title: "Verifikasi Gagal",
          description: e.message,
        }),
      },
    );

    throw redirect({ to: "/sign-in" });
  },

  component: () => <AppLoadingFallback />,
});
