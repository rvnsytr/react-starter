import { apiFetcher, ApiResponse } from "@/core/api";
import { authClient } from "@/core/auth";
import { DataTableState } from "@/core/components/ui/data-table";
import { userSchema } from "@/core/schema";
import { removeFiles } from "@/core/storage";
import { AuthSession } from "./constants";

export async function getSession() {
  const { data, error } = await authClient.getSession();
  if (error) throw new Error(error.message);
  return data as AuthSession | null;
}

export async function listUsers(
  state: DataTableState,
): Promise<ApiResponse<AuthSession["user"][]>> {
  const { data, ...rest } = await apiFetcher(
    "/auth/admin/list-users",
    userSchema.array(),
    {
      method: "POST",
      body: JSON.stringify(state),
      headers: { "Content-Type": "application/json" },
    },
  );

  return { ...rest, data: data as AuthSession["user"][] };
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
