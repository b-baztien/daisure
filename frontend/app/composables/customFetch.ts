import { useFetch, type AsyncData } from "#app";
import type { CustomFetchOptions } from "~/types/customFetchOptions";

export const useCustomFetch = <T, K = never>(
  url: string,
  options: CustomFetchOptions<T> = {},
) => {
  type Result = [K] extends [never] ? T : K;

  const runtimeConfig = useRuntimeConfig().public;
  const baseURL = runtimeConfig.baseURL || "";

  const fetchResult = useFetch(url, {
    ...options,
    baseURL: options?.baseURL || baseURL,
    watch: options?.watch || false,
    loading: options?.loading === false ? false : true,
    immediate: options.immediate ? false : (options.immediate ?? true),
    $fetch: useNuxtApp().$customFetch as typeof $fetch,
  } as CustomFetchOptions) as AsyncData<Result, any>;

  return fetchResult;
};
