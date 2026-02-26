import z from "zod";
import { fetcher } from "./api";
import { FileType } from "./constants/file";
import { ActionResponse } from "./constants/types";
import { sharedSchemas } from "./schema";
import { formatZodError } from "./utils/formaters";

export type Storage = z.infer<typeof storageSchema>;
export const storageSchema = z.object({
  id: z.uuidv4(),

  fileName: sharedSchemas.string({ min: 1, max: 255 }),
  category: z.enum(["image"]),
  filePath: z.string(),
  mimeType: z.string(),
  fileSize: z.number(),
  fileUrl: z.string().optional(),

  deletedAt: z.date().nullable().default(null),
  deletedBy: z.string().nullable().default(null),
  updatedAt: z.date().nullable().default(null),
  updatedBy: z.string().nullable().default(null),
  createdAt: z.date(),
  createdBy: z.string(),
});

export type UploadFilesData = z.infer<typeof uploadFilesDataSchema>;
const uploadFilesDataSchema = storageSchema.pick({
  id: true,
  fileName: true,
  category: true,
  filePath: true,
  mimeType: true,
  fileSize: true,
  fileUrl: true,
});

type UploadFilesOptions = {
  fileType?: FileType;
  fileName?: string;

  unique?: boolean;
  prefix?: string;
  suffix?: string;

  min?: number;
  max?: number;
  maxFileSize?: number;

  url?: boolean;
  withExtension?: boolean;
};

export function validateFiles(
  files: File[],
  options?: Pick<UploadFilesOptions, "min" | "max" | "maxFileSize">,
): ActionResponse<File[]> {
  const parsedFiles = sharedSchemas.files("image", options).safeParse(files);
  if (!parsedFiles.success) return formatZodError(parsedFiles.error);
  return parsedFiles;
}

export function prepareFiles(
  files: File[],
  category: Storage["category"],
  options?: UploadFilesOptions,
): ActionResponse<FormData> {
  const validated = validateFiles(files, options);
  if (!validated.success) return validated;

  const data = new FormData();
  validated.data.forEach((f) => data.append(category, f));
  if (options)
    Object.entries(options).map(([k, v]) => data.append(k, String(v)));

  return { success: true, data };
}

export async function uploadFiles(
  preparedFiles: FormData,
): Promise<ActionResponse<UploadFilesData[]>> {
  const body = preparedFiles;
  const schema = uploadFilesDataSchema.array();
  return await fetcher.api("/storage", { schema, method: "POST", body });
}

export async function removeFiles(ids: string[]) {
  return await fetcher.api("/storage", {
    schema: z.null(),
    method: "DELETE",
    body: JSON.stringify({ ids }),
    headers: { "Content-Type": "application/json" },
  });
}
