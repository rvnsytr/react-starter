import { authClient } from "@/core/auth";
import { removeFiles } from "@/core/storage";
import { AuthSession } from "./constants";

export async function getSession() {
  const { data, error } = await authClient.getSession();
  if (error) throw new Error(error.message);
  return data as AuthSession | null;
}

export async function getSessionList() {
  const { data, error } = await authClient.listSessions();
  if (error) throw new Error(error.message);
  return data;
}

export async function getUserList() {
  const { data, error } = await authClient.admin.listUsers({ query: {} });
  if (error) throw new Error(error.message);
  return data;
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
