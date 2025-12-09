import { sharedSchemas } from "@/core/schemas";
import { userSchema as authUserSchema } from "better-auth";
import z from "zod";
import { allRoles } from "./constants";

// export const userSchema = z.object({
//   image: z.string().nullable().default(null),

//   role: z.enum(allRoles),
//

// });

export const userSchema = authUserSchema.extend({
  role: z.enum(allRoles),
  email: sharedSchemas.email,
  name: sharedSchemas.string("Nama", { min: 1 }),

  password: sharedSchemas.string("Kata sandi", { min: 1 }),
  newPassword: sharedSchemas.password,
  confirmPassword: sharedSchemas.string("Konfirmasi kata sandi", { min: 1 }),
  currentPassword: sharedSchemas.string("Kata sandi saat ini", { min: 1 }),
});
