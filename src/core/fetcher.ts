import z from "zod";
import { apiConfig } from "./constants/app";

export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  count: z
    .intersection(
      z.object({ total: z.number() }),
      z.record(z.string(), z.number()),
    )
    .optional(),
});

export type ApiResponse<T> = z.infer<typeof apiResponseSchema> & {
  data: T;
  error?: unknown;
};

export type FetcherConfig<T> = RequestInit & {
  schema?: z.ZodType<T>;
  safeFetch?: boolean;
};

export type ApiFetcherConfig<T> = Omit<FetcherConfig<T>, "credentials">;

const fetcher = async <T>(
  url: string,
  config?: FetcherConfig<T>,
): Promise<T> => {
  const res = await fetch(url, config);
  const json = await res.json();

  if (!res.ok) {
    if (config?.safeFetch) return json;
    throw json;
  }

  if (!config?.schema) return json;
  return config.schema.parse(json);
};

fetcher.api = async <T>(
  path: string,
  config?: ApiFetcherConfig<T>,
): Promise<ApiResponse<T>> =>
  await fetcher(`${apiConfig.baseUrl}${path}`, {
    ...config,
    credentials: "include",
    schema: apiResponseSchema.extend({ data: config?.schema ?? z.any() }),
  });

fetcher.postJson = async <T>(
  path: string,
  config?: Omit<ApiFetcherConfig<T>, "method">,
) =>
  await fetcher.api(path, {
    ...config,
    method: "POST",
    headers: { ...config?.headers, "Content-Type": "application/json" },
  });

export { fetcher };
