import { authClient } from "@/core/auth";

export async function getSession() {
  const { data, error } = await authClient.getSession();
  if (error) throw new Error(error.message);
  return data;
}

export async function getSessionList() {
  const { data, error } = await authClient.listSessions();
  if (error) throw new Error(error.message);
  return data;
}

export async function getUserList() {
  const { data, error } = await authClient.admin.listUsers({
    query: { sortBy: "createdAt", sortDirection: "desc" },
  });
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

// export async function deleteUsers(
//   data: Pick<Session["user"], "id" | "image">[],
// ) {
//   return Promise.all(
//     data.map(async ({ id, image }) => {
//       if (image) await deleteProfilePicture(image);
//       return await auth.api.removeUser({
//         body: { userId: id },
//         headers: await headers(),
//       });
//     }),
//   );
// }
