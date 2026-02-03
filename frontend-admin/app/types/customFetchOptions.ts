import type { UseFetchOptions } from "#app";

export interface CustomFetchOptions<T = any> extends Omit<
  UseFetchOptions<T>,
  "body" | "params"
> {
  loading?: boolean;
  error?: boolean;
  body?: T | MaybeRefOrGetter<T>;
  params?: T | MaybeRefOrGetter<T>;
}
