import { sessionSchema, userSchema } from "@/modules/auth/schema";
import { apiConfig } from "@/shared/config/api";
import { ac, roles } from "@/shared/permission";
import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import z from "zod";
import { toast } from "./components/ui/toast";

export type AuthSession = { session: Session; user: User };
export type Session = z.infer<typeof sessionSchema>;
export type User = z.infer<typeof userSchema>;

export const authClient = createAuthClient({
  baseURL: `${apiConfig.baseUrl}/auth`,
  plugins: [adminClient({ ac, roles })],
  fetchOptions: {
    onError({ error }) {
      const e = "Terlalu banyak permintaan. Silakan coba beberapa saat lagi.";
      if (error.status === 429) toast.add({ type: "error", title: e });
    },
  },
});
