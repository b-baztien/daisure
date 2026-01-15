import { defineStore } from "pinia";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const useNotificationStore = defineStore("notification", () => {
  // State
  const notifications = ref<Notification[]>([]);
  const isLoading = ref(false);

  // Getters
  const unreadCount = computed(
    () => notifications.value.filter((n) => !n.isRead).length
  );

  const unreadNotifications = computed(() =>
    notifications.value.filter((n) => !n.isRead)
  );

  const recentNotifications = computed(() => notifications.value.slice(0, 5));

  // Actions
  async function fetchNotifications() {
    isLoading.value = true;
    try {
      const { apiFetch } = useApi();
      const data = await apiFetch<Notification[]>("/notifications");
      notifications.value = data;
    } catch (error) {
      console.error("Fetch notifications error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function markAsRead(id: string) {
    try {
      const { apiFetch } = useApi();
      await apiFetch(`/notifications/${id}/read`, {
        method: "PATCH",
      });

      const notification = notifications.value.find((n) => n.id === id);
      if (notification) {
        notification.isRead = true;
      }
    } catch (error) {
      console.error("Mark as read error:", error);
      throw error;
    }
  }

  async function markAllAsRead() {
    try {
      const { apiFetch } = useApi();
      await apiFetch("/notifications/read-all", {
        method: "PATCH",
      });

      notifications.value.forEach((n) => {
        n.isRead = true;
      });
    } catch (error) {
      console.error("Mark all as read error:", error);
      throw error;
    }
  }

  function addNotification(notification: Notification) {
    notifications.value.unshift(notification);
  }

  return {
    // State
    notifications,
    isLoading,
    // Getters
    unreadCount,
    unreadNotifications,
    recentNotifications,
    // Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
  };
});
