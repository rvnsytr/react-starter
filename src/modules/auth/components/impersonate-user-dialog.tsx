'use client";';

import { authClient, User } from "@/core/auth";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@/core/components/ui/alert-dialog";
import { Button } from "@/core/components/ui/button";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { useNavigate } from "@tanstack/react-router";
import { Layers2Icon } from "lucide-react";
import { roleConfig } from "../config/role";
import { mutateSession } from "../hooks/use-session";

export function ImpersonateUserDialog({
  data,
  open,
  setOpen,
  setIsLoading,
}: {
  data: Pick<User, "id" | "name">;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();

  const clickHandler = () => {
    setIsLoading(true);
    toast.promise(
      authClient.admin.impersonateUser({ userId: data.id }).then((res) => {
        if (res.error) throw res.error;
        return res.data;
      }),
      {
        loading: { title: messages.loading },
        success: (res) => {
          setIsLoading(false);
          mutateSession();
          const to =
            res.user.role === "admin" ? "/dashboard/users" : "/dashboard";
          navigate({ to });
          return {
            title: messages.success,
            description: <span>Anda sekarang masuk sebagai {data.name}.</span>,
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Layers2Icon /> Impersonasi {data.name}
          </AlertDialogTitle>
          <div className="grid gap-y-2">
            <AlertDialogDescription>
              <b>Mode Impersonasi</b> adalah fitur khusus{" "}
              <b>{roleConfig.admin.label}</b> yang memungkinkan Anda masuk ke
              akun pengguna lain tanpa harus mengetahui kata sandi mereka.
            </AlertDialogDescription>

            <AlertDialogDescription>
              Saat dalam <b>Mode Impersonasi</b>, Anda akan memiliki akses penuh
              ke akun pengguna yang dipilih <b>( {data.name} )</b>. Yakin ingin
              melanjutkan?
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogClose
            render={<Button variant="ghost">{messages.actions.cancel}</Button>}
          />
          <AlertDialogClose
            render={
              <Button onClick={clickHandler} autoFocus>
                {messages.actions.confirm}
              </Button>
            }
          />
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
