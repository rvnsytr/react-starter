import z from "zod";
import { apiFetcher } from "./api";
import { storageSchema } from "./schema";

export async function uploadFiles(
  body: FormData,
  options?: { url?: boolean; fileName?: string },
) {
  const basePath = "/storage";
  const optionsQuery = options
    ? `?${Object.entries(options)
        .map(([k, v]) => `${k}=${String(v)}`)
        .join("&")}`
    : "";

  const url = `${basePath}${optionsQuery}`;

  const schema = storageSchema
    .pick({
      id: true,
      fileName: true,
      category: true,
      filePath: true,
      mimeType: true,
      fileSize: true,
      fileUrl: true,
    })
    .array();

  return await apiFetcher(url, schema, { method: "POST", body });
}

export async function removeFiles(ids: string[]) {
  return await apiFetcher("/storage", z.null(), {
    method: "DELETE",
    body: JSON.stringify({ ids }),
    headers: { "Content-Type": "application/json" },
  });
}
