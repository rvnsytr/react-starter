import { ApiResponse } from "@/core/api";
import { authClient } from "@/core/auth";
import { DataTableState } from "@/core/components/ui/data-table";
import { removeFiles } from "@/core/storage";
import { AuthSession } from "./constants";

export async function getSession() {
  const { data, error } = await authClient.getSession();
  if (error) throw new Error(error.message);
  return data as AuthSession | null;
}

// TODO
export async function listUsers(
  state: DataTableState,
): Promise<ApiResponse<AuthSession["user"][]>> {
  console.log(state);

  return {
    code: 200,
    success: true,
    message: "",
    count: { total: 0 },
    data: [] as AuthSession["user"][],
  };
}

export async function listSessions() {
  const { data, error } = await authClient.listSessions();
  if (error) throw new Error(error.message);
  return data;
}

export async function listUserSessions(userId: string) {
  const { data, error } = await authClient.admin.listUserSessions({ userId });
  if (error) throw new Error(error.message);
  return data.sessions as AuthSession["session"][];
}

export async function revokeUserSessions(ids: string[]) {
  return Promise.all(
    ids.map(
      async (id) => await authClient.admin.revokeUserSessions({ userId: id }),
    ),
  );
}

export async function removeUsers(
  data: Pick<AuthSession["user"], "id" | "image">[],
) {
  return Promise.all(
    data.map(async ({ id, image }) => {
      if (image) await removeFiles([image]);
      return await authClient.admin.removeUser({ userId: id });
    }),
  );
}
