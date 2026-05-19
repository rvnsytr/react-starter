"use client";

import { authClient } from "@/core/auth";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/core/components/ui/sidebar";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { useNavigate } from "@tanstack/react-router";
import { Layers2Icon } from "lucide-react";
import { useState } from "react";
import { roleConfig } from "../config/role";
import { mutateSession, useSession } from "../hooks/use-session";

export function StopImpersonateUserMenuItem() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { session, user } = useSession();
  if (!session.impersonatedBy) return;

  const clickHandler = () => {
    setIsLoading(true);
    toast.promise(
      authClient.admin.stopImpersonating().then((res) => {
        if (res.error) throw res.error;
        return res.data;
      }),
      {
        loading: { title: messages.loading },
        success: () => {
          setIsLoading(false);
          mutateSession();
          navigate({ to: "/dashboard/users" });
          return {
            title: messages.success,
            description: (
              <span>
                Anda telah kembali ke sesi <b>{roleConfig.admin.label}</b> Anda.
              </span>
            ),
          };
        },
        error: (e) => {
          setIsLoading(false);
          return { title: messages.error, description: e.message };
        },
      },
    );
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={`Keluar dari sesi ${user.name}`}
        variant="destructive-ghost"
        onClick={clickHandler}
        disabled={isLoading}
      >
        <LoadingSpinner loading={isLoading} icon={{ base: <Layers2Icon /> }} />
        Kembali ke akun saya
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
