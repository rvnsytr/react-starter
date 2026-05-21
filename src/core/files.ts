import { FileType } from "@/shared/config";
import z from "zod";
import { fetcher } from "./fetcher";
import { sharedSchemas } from "./schema";
import { ActionResponse } from "./types";
import { formatZodError } from "./utils";

export type Files = z.infer<typeof filesSchema>;
export const filesSchema = z.object({
  id: z.uuidv4(),

  category: z.enum(["avatar"]),
  filePath: z.string(),
  fileName: sharedSchemas.string({ min: 1, max: 255 }),
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
const uploadFilesDataSchema = filesSchema.pick({
  id: true,
  category: true,
  filePath: true,
  fileName: true,
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

  minFiles?: number;
  maxFiles?: number;
  maxSize?: number;

  url?: boolean;
  withExtension?: boolean;
};

export function validateFiles(
  files: File[],
  options?: Pick<UploadFilesOptions, "minFiles" | "maxFiles" | "maxSize">,
): ActionResponse<File[]> {
  const parsedFiles = sharedSchemas.files("image", options).safeParse(files);
  if (!parsedFiles.success) return formatZodError(parsedFiles.error);
  return parsedFiles;
}

export function prepareFiles(
  files: File[],
  category: Files["category"],
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
  return await fetcher.api("/files", { schema, method: "POST", body });
}

export async function removeFiles(ids: string[]) {
  return await fetcher.api("/files", {
    schema: z.null(),
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
}
