import { apiFetcher } from "@/core/api";
import { authClient } from "@/core/auth";
import { storageSchema } from "@/core/schemas";
import { AuthSession } from "./constants";

export async function getSession(): Promise<
  (AuthSession & { imageId: string | null }) | null
> {
  const { data, error } = await authClient.getSession();
  if (error) throw new Error(error.message);

  if (!data) return data;
  const defaultData = { imageId: null, ...data };

  const { session, user: userData } = data;
  const { image: imageId, ...rest } = userData;

  if (!imageId) return defaultData;

  // TODO: Abstract this
  const body = JSON.stringify({ data: [imageId] });
  const res = await apiFetcher(
    "/storage/presigned-url",
    storageSchema.pick({ id: true, fileUrl: true }).array(),
    { method: "POST", body, headers: { "Content-Type": "application/json" } },
  );

  if (!res.data) return defaultData;

  return {
    session,
    user: { image: res.data[0].fileUrl, ...rest },
    imageId,
  };
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

// export async function deleteProfilePicture(image: string) {
//   await deleteFiles([await extractKeyFromPublicUrl(image)]);
// }

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
