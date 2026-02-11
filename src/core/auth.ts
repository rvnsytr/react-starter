import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";
import { apiConfig } from "./constants/app";

export const authClient = createAuthClient({
  baseURL: `${apiConfig.baseUrl}/auth`,
  plugins: [adminClient()],
  fetchOptions: {
    onError({ error }) {
      if (error.status === 429) {
        toast.error(
          "Terlalu banyak permintaan. Silakan coba beberapa saat lagi.",
        );
      }
    },
  },
});
