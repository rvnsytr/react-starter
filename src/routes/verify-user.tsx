import { authClient } from "@/core/auth";
import { AppLoadingFallback } from "@/core/components/ui/fallback";
import { messages } from "@/core/constants";
import { getRouteTitle } from "@/core/utils";
import { mutateListUsers } from "@/modules/auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { useEffect, useEffectEvent, useState } from "react";
import { toast } from "sonner";

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
        authClient.verifyEmail({ query: { token, callbackURL: "/sign-in" } }),
        {
          loading: messages.loading,
          success: () => {
            setIsverifying(false);
            navigate({ to: "/sign-in" });
            mutateListUsers();
            return "Akun Anda berhasil diverifikasi. Silakan masuk untuk melanjutkan.";
          },
          error: (e) => {
            setIsverifying(false);
            navigate({ to: "/sign-in" });
            return e.message;
          },
        },
      );
    } else {
      setIsverifying(false);
      navigate({ to: "/sign-in" });
      toast.error("Verifikasi gagal, token atau tipe tidak ditemukan");
    }
  });

  useEffect(() => onMount(), []);

  return (
    <AnimatePresence>{isverifying && <AppLoadingFallback />};</AnimatePresence>
  );
}
