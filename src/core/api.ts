import z from "zod";
import { DataState } from "./components/ui/data-controller";
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
  url: string,
  config?: ApiFetcherConfig<T>,
): Promise<ApiResponse<T>> =>
  await fetcher(`${apiConfig.baseUrl}${url}`, {
    ...config,
    credentials: "include",
    schema: apiResponseSchema.extend({ data: config?.schema ?? z.any() }),
  });

fetcher.data = async <T>(
  key: string,
  state: DataState,
  config?: Omit<ApiFetcherConfig<T>, "method" | "body">,
) =>
  await fetcher.api(key, {
    ...config,
    method: "POST",
    body: JSON.stringify(state),
    headers: { "Content-Type": "application/json", ...config?.headers },
  });

export { fetcher };
