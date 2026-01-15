import { defineStore } from "pinia";

interface Review {
  id: string;
  transactionId: string;
  rating: number;
  comment: string;
  reviewer: {
    displayName: string;
    pictureUrl?: string;
  };
  createdAt: string;
}

export const useReviewStore = defineStore("review", () => {
  // State
  const reviews = ref<Review[]>([]);
  const userStats = ref<any>(null);
  const isLoading = ref(false);

  // Getters
  const averageRating = computed(() => {
    if (reviews.value.length === 0) return 0;
    const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.value.length).toFixed(1);
  });

  const reviewCount = computed(() => reviews.value.length);

  const ratingDistribution = computed(() => {
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.value.forEach((r) => {
      dist[r.rating]++;
    });
    return dist;
  });

  // Actions
  async function fetchReviews(userId?: string) {
    isLoading.value = true;
    try {
      const { apiFetch } = useApi();
      const endpoint = userId
        ? `/reviews/user/${userId}`
        : "/reviews/my-reviews";
      const data = await apiFetch<Review[]>(endpoint);
      reviews.value = data;
    } catch (error) {
      console.error("Fetch reviews error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUserStats(userId: string) {
    isLoading.value = true;
    try {
      const { apiFetch } = useApi();
      const data = await apiFetch<any>(`/reviews/user/${userId}/stats`);
      userStats.value = data;
      return data;
    } catch (error) {
      console.error("Fetch user stats error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function createReview(payload: any) {
    isLoading.value = true;
    try {
      const { apiFetch } = useApi();
      const data = await apiFetch<Review>("/reviews", {
        method: "POST",
        body: payload,
      });
      reviews.value.unshift(data);
      return data;
    } catch (error) {
      console.error("Create review error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function addResponse(reviewId: string, comment: string) {
    isLoading.value = true;
    try {
      const { apiFetch } = useApi();
      const data = await apiFetch<Review>(`/reviews/${reviewId}/response`, {
        method: "POST",
        body: { comment },
      });

      const index = reviews.value.findIndex((r) => r.id === reviewId);
      if (index !== -1) {
        reviews.value[index] = data;
      }

      return data;
    } catch (error) {
      console.error("Add response error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    reviews,
    userStats,
    isLoading,
    // Getters
    averageRating,
    reviewCount,
    ratingDistribution,
    // Actions
    fetchReviews,
    fetchUserStats,
    createReview,
    addResponse,
  };
});
