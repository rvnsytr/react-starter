import { sharedSchemas } from "@/core/schemas";
import z from "zod";
import { allRoles } from "./constants";

export const userSchema = z.object({
  id: z.uuidv4(),
  image: z.string().nullable().default(null),

  role: z.enum(allRoles),
  email: sharedSchemas.email,
  name: sharedSchemas.string("Nama", { min: 1 }),

  password: sharedSchemas.string("Kata sandi", { min: 1 }),
  newPassword: sharedSchemas.password,
  confirmPassword: sharedSchemas.string("Konfirmasi kata sandi", { min: 1 }),
  currentPassword: sharedSchemas.string("Kata sandi saat ini", { min: 1 }),

  agreement: z.boolean().refine((v) => v, {
    error:
      "Mohon setujui ketentuan layanan dan kebijakan privasi untuk melanjutkan.",
  }),
});

export const sessionSchema = z.object({
  user: userSchema.pick({
    id: true,
    image: true,
    name: true,
    email: true,
    role: true,
  }),

  ip: z.string().nullable(),
  userAgent: z.string().nullable(),

  iat: z.number(),
  exp: z.number(),
});
