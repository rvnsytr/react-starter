import { apiFetcher } from "@/core/api";
import { Route, routesMeta } from "@/core/constants";
import { Role } from "./constants";
import { sessionSchema } from "./schemas";

export function authorize(currentRoute: Route, allowedRoles: Role[]) {
  const meta = routesMeta[currentRoute];
  if (!meta.role) return 404;

  console.log(allowedRoles);
  return 200;
}

export async function getSession() {
  const key = "/auth/session";
  const schema = sessionSchema.nullable();
  const config = { safeFetch: true };
  const res = await apiFetcher(key, schema, config);
  return res.data ?? null;
}

// export async function getAllUsers() {
//   const headers = await nextHeaders();
//   const schema = zodUserWithProfile.array();
//   return (await apiFetcher("/user", schema, { headers })).data;
// }

// export async function getMyProfile() {
//   const headers = await nextHeaders();
//   const schema = zodUserWithProfile;
//   return (await apiFetcher("/user/me", schema, { headers })).data;
// }
