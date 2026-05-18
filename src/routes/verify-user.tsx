import { authClient } from "@/core/auth";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { getRouteTitle } from "@/core/route";
import { AppLoadingFallback } from "@/shared/components/fallback";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { useEffect, useEffectEvent, useState } from "react";

export const Route = createFileRoute("/verify-user")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search?.token ?? null) as string | null,
  }),
  head: () => ({ meta: [{ title: getRouteTitle("/verify-user") }] }),
  component: RouteComponent,
});

function RouteComponent() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [isverifying, setIsverifying] = useState<boolean>(false);

  const onMount = useEffectEvent(() => {
    if (token) {
      setIsverifying(true);
      toast.promise(
        authClient.verifyEmail({ query: { token } }).then((res) => {
          if (res.error) throw res.error;
          return res.data;
        }),
        {
          loading: { title: messages.loading },
          success: () => {
            setIsverifying(false);
            navigate({ to: "/sign-in" });
            return {
              title: "Verifikasi Berhasil",
              description: "Silakan masuk untuk melanjutkan.",
            };
          },
          error: (e) => {
            setIsverifying(false);
            navigate({ to: "/sign-in" });
            return { title: "Verifikasi Gagal", description: e.message };
          },
        },
      );
    } else {
      setIsverifying(false);
      navigate({ to: "/sign-in" });
      toast.add({
        type: "error",
        title: "Token tidak ditemukan",
        description: "Token verifikasi tidak ditemukan. Silakan coba lagi.",
      });
    }
  });

  useEffect(() => onMount(), []);

  return (
    <AnimatePresence>{isverifying && <AppLoadingFallback />};</AnimatePresence>
  );
}
