import z from "zod";
import { fetcher } from "./api";
import { sharedSchemas } from "./schema";

export const storageSchema = z.object({
  id: z.uuidv4(),

  fileName: sharedSchemas.string("Nama file", { min: 1, max: 255 }),
  category: z.enum(["image"]),
  filePath: sharedSchemas.string("File path", { min: 1, max: 500 }),
  mimeType: sharedSchemas.string("Tipe file", { max: 100 }),
  fileSize: sharedSchemas.number("Ukuran file"),
  fileUrl: sharedSchemas.string("File URL", { min: 1 }).optional(),

  deletedAt: sharedSchemas.date("deletedAt").nullable().default(null),
  deletedBy: sharedSchemas.string("deletedBy").nullable().default(null),
  updatedAt: sharedSchemas.date("updatedAt").nullable().default(null),
  updatedBy: sharedSchemas.string("updatedBy").nullable().default(null),
  createdAt: sharedSchemas.date("createdAt"),
  createdBy: sharedSchemas.string("createdBy"),
});

type UploadFilesOptions = {
  url?: boolean;
  fileName?: string;
  withExtension?: boolean;
};

export async function uploadFiles(
  body: FormData,
  options?: UploadFilesOptions,
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

  return await fetcher.api(url, { schema, method: "POST", body });
}

export async function removeFiles(ids: string[]) {
  return await fetcher.api("/storage", {
    schema: z.null(),
    method: "DELETE",
    body: JSON.stringify({ ids }),
    headers: { "Content-Type": "application/json" },
  });
}
