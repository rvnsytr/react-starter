"use client";

import { authClient } from "@/core/auth";
import { SidebarMenuButton } from "@/core/components/ui/sidebar";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { LogOutIcon } from "lucide-react";
import { useState } from "react";

export function signOutClient({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (e: Error) => void;
} = {}) {
  toast.promise(
    authClient.signOut().then((res) => {
      if (res.error) throw res.error;
      return res.data;
    }),
    {
      loading: { title: messages.loading },
      success: () => {
        onSuccess?.();
        const url = `${import.meta.env.BASE_URL}sign-in`;
        setTimeout(() => (location.href = url), 1000);
        return { title: "Berhasil keluar - Sampai jumpa!" };
      },
      error: (e) => {
        onError?.(e);
        return { title: messages.error, description: e.message };
      },
    },
  );
}

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = () => {
    setIsLoading(true);
    signOutClient({ onError: () => setIsLoading(false) });
  };

  return (
    <SidebarMenuButton
      tooltip="Keluar"
      variant="destructive-ghost"
      onClick={clickHandler}
      disabled={isLoading}
    >
      <LoadingSpinner loading={isLoading} icon={{ base: <LogOutIcon /> }} />
      Keluar
    </SidebarMenuButton>
  );
}
