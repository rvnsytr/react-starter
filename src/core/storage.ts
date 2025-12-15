import z from "zod";
import { apiFetcher } from "./api";
import { storageSchema } from "./schemas";

export async function uploadFiles(
  body: FormData,
  options?: { url?: boolean; fileName?: string },
) {
  const basePath = "/storage";
  const optionsQuery = options
    ? "?" +
      Object.entries(options)
        .map(([key, value]) => `${key}=${String(value)}`)
        .join("&")
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

export async function removeFile(id: string) {
  return await apiFetcher(`/storage/${id}`, z.number(), { method: "DELETE" });
}
