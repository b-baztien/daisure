import type { CustomFetchOptions } from "~/types/customFetchOptions";

export default defineNuxtPlugin(() => {
  const { setAccessToken, setRefreshToken, accessToken, clearAllTokens } =
    useAuth();
  const alert = useAlert();

  const { openLoading, closeLoading } = useLoadingStore();

  const $customFetch = $fetch.create({
    onRequest({ options }) {
      const { loading } = options as CustomFetchOptions<any>;

      if (loading) {
        openLoading();
      }

      if (options.query) {
        const cleanedQuery: Record<string, any> = {};
        for (const [key, value] of Object.entries(options.query)) {
          if (value !== null && value !== undefined && value !== "") {
            cleanedQuery[key] = value;
          }
        }
        options.query = cleanedQuery;
      }

      if (accessToken.value) {
        if (!options.headers) {
          options.headers = new Headers();
        }

        if (options.headers instanceof Headers) {
          options.headers.set("Authorization", `Bearer ${accessToken.value}`);
        }
      }
    },
    onResponse({ response, options }) {
      const { loading } = options as CustomFetchOptions<any>;
      if (loading) {
        closeLoading();
      }

      const _accessToken = response._data?.access_token;
      const _refreshToken = response._data?.verification_token;

      if (_accessToken) {
        setAccessToken(_accessToken);
      }

      if (_refreshToken) {
        setRefreshToken(_refreshToken);
      }
    },
    async onResponseError({ response, options }) {
      const { loading, error } = options as CustomFetchOptions<any>;

      if (loading) {
        closeLoading();
      }

      const { status, _data } = response;

      if (error) {
        alert.error(response?._data);
      }

      switch (status) {
        case 401: {
          clearAllTokens();
          await navigateTo("/auth/login");
          break;
        }
        case 403: {
          console.error(
            "Forbidden: You don't have permission to access this resource",
          );
          break;
        }
        case 404: {
          console.error("Resource not found");
          break;
        }
        case 422: {
          console.error("Validation error:", _data);
          break;
        }
        case 500: {
          console.error("Server error: Something went wrong on the server");
          break;
        }
        case 502:
        case 503:
        case 504: {
          console.error(
            "Service temporarily unavailable. Please try again later.",
          );
          break;
        }
        default: {
          console.error(
            `Error ${status}:`,
            _data?.message || "An error occurred",
          );
          break;
        }
      }

      throw response;
    },
    onRequestError({ error }) {
      closeLoading();

      console.error("Network error:", error);

      throw error;
    },
  });

  return {
    provide: {
      customFetch: $customFetch,
    },
  };
});
