import { sharedSchemas } from "@/core/schema";
import {
  sessionSchema as betterAuthSessionSchema,
  userSchema as betterAuthUserSchema,
} from "better-auth";
import z from "zod";
import { allRoles } from "./constants";

export const passwordSchema = z.object({
  password: sharedSchemas.string({ label: "Kata sandi", min: 8 }),
  newPassword: sharedSchemas.password,
  confirmPassword: sharedSchemas.string({
    label: "Konfirmasi kata sandi",
    min: 1,
    withRequired: true,
  }),
  currentPassword: sharedSchemas.string({
    label: "Kata sandi saat ini",
    min: 1,
    withRequired: true,
  }),
});

export const userSchema = betterAuthUserSchema.extend({
  email: sharedSchemas.email,
  name: sharedSchemas.string({ label: "Nama", min: 1, withRequired: true }),
  image: z.string().optional().nullable(),
  role: z.enum(allRoles),
  banned: z.boolean().optional().nullable(),
  banReason: z.string().optional().nullable(),
  banExpires: z.date().optional().nullable(),
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
});

export const sessionSchema = betterAuthSessionSchema.extend({
  impersonatedBy: z.string().nullable().optional(),
});
