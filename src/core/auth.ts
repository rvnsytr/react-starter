import { sessionSchema, userSchema } from "@/modules/auth/schema";
import { ac, roles } from "@/shared/permission";
import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import z from "zod";
import { toast } from "./components/ui/toast";

export type AuthSession = {
  session: z.infer<typeof sessionSchema>;
  user: z.infer<typeof userSchema>;
};

export const authClient = createAuthClient({
  plugins: [adminClient({ ac, roles })],
  fetchOptions: {
    onError({ error }) {
      const e = "Terlalu banyak permintaan. Silakan coba beberapa saat lagi.";
      if (error.status === 429) toast.add({ type: "error", title: e });
    },
  },
});
