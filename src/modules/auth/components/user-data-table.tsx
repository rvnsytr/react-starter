"use client";

import { User } from "@/core/auth";
import { DataTable } from "@/core/components/data-table";
import { Button } from "@/core/components/ui/button";
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@/core/components/ui/menu";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { fetcher } from "@/core/fetcher";
import {
  DataControllerState,
  mutateControlledData,
} from "@/core/hooks/use-data-controller";
import { messages } from "@/core/messages";
import { BanIcon, MonitorOff, Settings2Icon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { authKeys } from "../config/keys";
import { useSession } from "../hooks/use-session";
import { userSchema } from "../schema";
import { ActionDeleteUsersDialog } from "./delete-user-dialog";
import { ActionRevokeUserSessionsDialog } from "./revoke-user-sessions-dialog";
import { getUserColumns } from "./user-columns";
import { UserDetailDialog } from "./user-detail-dialog";

export const mutateUserDataTable = () => mutateControlledData(authKeys.users);

export function UserDataTable() {
  const { user } = useSession();

  const [data, setData] = useState<User | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  const [isRevokeSessionsDialogOpen, setIsRevokeSessionsDialogOpen] =
    useState<boolean>(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] =
    useState<boolean>(false);

  const queryFetcher = async (state: DataControllerState) => {
    const body = JSON.stringify(state);
    const schema = userSchema.array();
    return fetcher.api(authKeys.users, { method: "POST", body, schema });
  };

  return (
    <>
      <DataTable
        mode="auto"
        columns={getUserColumns}
        query={{ key: authKeys.users, fetcher: queryFetcher }}
        getRowId={(row) => row.id}
        enableRowSelection={(row) => row.original.id !== user.id}
        placeholder={{ search: "Cari Pengguna..." }}
        shortcuts={{
          filter: "F",
          sort: "S",
          view: "V",
          reset: "R",
          search: "/",
        }}
        fullWidthOnMobile
        onRowClick={(row) => setData(row.original)}
        renderRowSelectionButton={({ table, rows }) => {
          const rowData = rows.map((row) => row.original);
          return (
            <>
              <Menu>
                <MenuTrigger
                  render={
                    <Button variant="outline" disabled={isActionLoading}>
                      <LoadingSpinner
                        icon={{ base: <Settings2Icon /> }}
                        loading={isActionLoading}
                      />
                      {messages.actions.action}
                    </Button>
                  }
                />

                <MenuPopup>
                  <MenuGroup>
                    <MenuGroupLabel className="text-center">
                      Akun dipilih: <b>{rowData.length}</b>
                    </MenuGroupLabel>

                    <MenuSeparator />

                    <MenuItem
                      onClick={() => setIsRevokeSessionsDialogOpen(true)}
                    >
                      <MonitorOff /> Akhiri Sesi
                    </MenuItem>

                    <MenuSeparator />

                    {/* // TODO */}
                    <MenuItem variant="destructive" disabled>
                      <BanIcon /> Blokir
                    </MenuItem>

                    <MenuItem
                      variant="destructive"
                      onClick={() => setIsDeleteUserDialogOpen(true)}
                    >
                      <Trash2Icon /> Hapus
                    </MenuItem>
                  </MenuGroup>
                </MenuPopup>
              </Menu>

              <ActionRevokeUserSessionsDialog
                userIds={rowData.map(({ id }) => id)}
                open={isRevokeSessionsDialogOpen}
                setOpen={setIsRevokeSessionsDialogOpen}
                setIsLoading={setIsActionLoading}
                onSuccess={() => {
                  setIsRevokeSessionsDialogOpen(false);
                  table.resetRowSelection();
                  mutateUserDataTable();
                }}
              />

              <ActionDeleteUsersDialog
                userIds={rowData.map(({ id }) => id)}
                open={isDeleteUserDialogOpen}
                loading={isActionLoading}
                setOpen={setIsDeleteUserDialogOpen}
                setIsLoading={setIsActionLoading}
                onSuccess={() => {
                  table.resetRowSelection();
                  mutateUserDataTable();
                }}
              />
            </>
          );
        }}
      />

      <UserDetailDialog data={data} setData={setData} />
    </>
  );
}
