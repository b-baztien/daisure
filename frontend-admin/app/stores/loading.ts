export const useLoadingStore = defineStore("loading", () => {
  const loadingCount = ref(0);

  const loading = computed(() => {
    return loadingCount.value > 0;
  });

  function openLoading() {
    loadingCount.value++;
  }

  function closeLoading() {
    loadingCount.value--;

    if (loadingCount.value <= 0) {
      loadingCount.value = 0;
    }
  }

  return { loading, openLoading, closeLoading };
});
