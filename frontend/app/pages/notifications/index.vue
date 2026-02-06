<script setup lang="ts">
const notificationStore = useNotificationStore();

const isLoading = ref(true);

// Fetch notifications
onMounted(async () => {
  try {
    await notificationStore.fetchNotifications();
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
  } finally {
    isLoading.value = false;
  }
});

// Mark notification as read
async function markAsRead(id: string) {
  try {
    await notificationStore.markAsRead(id);
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
}

// Mark all as read
async function markAllAsRead() {
  try {
    await notificationStore.markAllAsRead();
  } catch (error) {
    console.error("Failed to mark all as read:", error);
  }
}

// Delete notification
async function deleteNotification(id: string) {
  if (!confirm("ต้องการลบการแจ้งเตือนนี้?")) {
    return;
  }

  try {
    await notificationStore.deleteNotification(id);
  } catch (error) {
    console.error("Failed to delete notification:", error);
  }
}

// Get notification icon
function getNotificationIcon(type: string) {
  const iconMap: Record<string, string> = {
    transaction: "i-heroicons-shopping-bag",
    payment: "i-heroicons-banknotes",
    review: "i-heroicons-star",
    system: "i-heroicons-bell",
    dispute: "i-heroicons-exclamation-triangle",
  };
  return iconMap[type] || "i-heroicons-bell";
}

// Get notification color
function getNotificationColor(type: string) {
  const colorMap: Record<string, string> = {
    transaction: "blue",
    payment: "green",
    review: "yellow",
    system: "gray",
    dispute: "red",
  };
  return colorMap[type] || "gray";
}

// Format date
function formatDate(date: string) {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "เมื่อสักครู่";
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  if (days < 7) return `${days} วันที่แล้ว`;

  return d.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          การแจ้งเตือน
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          ดูการแจ้งเตือนและอัพเดทต่างๆ
        </p>
      </div>
      <UButton
        v-if="notificationStore.unreadCount > 0"
        color="gray"
        variant="outline"
        @click="markAllAsRead"
      >
        ทำเครื่องหมายว่าอ่านทั้งหมด
      </UButton>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <Icon
        name="i-heroicons-arrow-path"
        class="w-12 h-12 text-blue-600 animate-spin"
      />
    </div>

    <!-- Notifications List -->
    <div v-else>
      <!-- Empty State -->
      <div
        v-if="notificationStore.notifications.length === 0"
        class="text-center py-12"
      >
        <UCard>
          <Icon
            name="i-heroicons-bell-slash"
            class="w-16 h-16 text-gray-400 mx-auto mb-4"
          />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            ไม่มีการแจ้งเตือน
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            คุณจะได้รับการแจ้งเตือนเมื่อมีกิจกรรมใหม่
          </p>
        </UCard>
      </div>

      <!-- Notifications -->
      <div v-else class="space-y-4">
        <UCard
          v-for="notification in notificationStore.notifications"
          :key="notification._id"
          :class="['transition-all', notification.isRead ? 'opacity-60' : '']"
        >
          <div class="flex items-start space-x-4">
            <!-- Icon -->
            <div
              :class="`bg-${getNotificationColor(notification.type)}-100 dark:bg-${getNotificationColor(notification.type)}-900 p-3 rounded-lg flex-shrink-0`"
            >
              <Icon
                :name="getNotificationIcon(notification.type)"
                :class="`w-6 h-6 text-${getNotificationColor(notification.type)}-600`"
              />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    {{ notification.title }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 mt-1">
                    {{ notification.message }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    {{ formatDate(notification.createdAt) }}
                  </p>
                </div>

                <!-- Unread Badge -->
                <div v-if="!notification.isRead" class="ml-4">
                  <div class="w-2 h-2 bg-blue-600 rounded-full" />
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-2 mt-4">
                <UButton
                  v-if="notification.actionUrl"
                  :to="notification.actionUrl"
                  color="blue"
                  size="sm"
                  @click="markAsRead(notification._id)"
                >
                  {{ notification.actionText || "ดูรายละเอียด" }}
                </UButton>
                <UButton
                  v-if="!notification.isRead"
                  color="gray"
                  variant="ghost"
                  size="sm"
                  @click="markAsRead(notification._id)"
                >
                  ทำเครื่องหมายว่าอ่านแล้ว
                </UButton>
                <UButton
                  color="gray"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-trash"
                  @click="deleteNotification(notification._id)"
                />
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Load More (if needed) -->
      <div v-if="notificationStore.hasMore" class="mt-6 text-center">
        <UButton
          color="gray"
          variant="outline"
          @click="notificationStore.loadMore()"
        >
          โหลดเพิ่มเติม
        </UButton>
      </div>
    </div>
  </div>
</template>
