import { sharedSchemas } from "@/core/schema";
import {
  sessionSchema as betterAuthSessionSchema,
  userSchema as betterAuthUserSchema,
} from "better-auth";
import z from "zod";
import { allRoles } from "./constants";

export const passwordSchema = z.object({
  password: sharedSchemas.string("Kata sandi", { min: 1 }),
  newPassword: sharedSchemas.password,
  confirmPassword: sharedSchemas.string("Konfirmasi kata sandi", { min: 1 }),
  currentPassword: sharedSchemas.string("Kata sandi saat ini", { min: 1 }),
});

export const userSchema = betterAuthUserSchema.extend({
  email: sharedSchemas.email,
  name: sharedSchemas.string("Nama", { min: 1 }),
  image: z.string().optional().nullable(),
  role: z.enum(allRoles),
  banned: z.boolean().optional().nullable(),
  banReason: z.string().optional().nullable(),
  banExpires: z.coerce.date().optional().nullable(),

  createdAt: sharedSchemas.date("createdAt"),
  updatedAt: sharedSchemas.date("updatedAt"),
});

export const sessionSchema = betterAuthSessionSchema.extend({
  impersonatedBy: z.string().nullable().optional(),
});
