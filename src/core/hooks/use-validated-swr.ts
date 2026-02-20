import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import { fetcher, FetcherConfig } from "../api";

export type UseValidatedSWRConfig<T> = {
  swr?: SWRConfiguration;
  fetcher?: FetcherConfig<T>;
};

export function useValidatedSWR<T>(
  key: string,
  config?: UseValidatedSWRConfig<T>,
): SWRResponse<T> {
  const fn = async () => await fetcher(key, config?.fetcher);
  return useSWR(key, fn, config?.swr);
}
