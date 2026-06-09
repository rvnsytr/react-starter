import { Route } from "@/core/types";

export const appConfig = {
  name: "React Starter",
  description: "App description...",

  logo: {
    default: `${import.meta.env.BASE_URL}logo.png`,
    withText: `${import.meta.env.BASE_URL}logo-text.png`,
  },

  default: {
    language: "id",

    /** @see [route.ts](../../core/route.ts) / createSignInURL */
    callbackUrls: ["/", "/dashboard"] satisfies Route[] as Route[],
  },
} as const;
