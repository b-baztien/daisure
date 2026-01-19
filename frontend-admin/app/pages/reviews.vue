<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Reviews Management
      </h1>

      <UButton
        icon="i-heroicons-arrow-path"
        @click="fetchReviews"
        :loading="loading"
      >
        Refresh
      </UButton>
    </div>

    <!-- Filters -->
    <UCard>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <UFormField label="Status">
          <USelect
            v-model="filters.isHidden"
            :options="statusOptions"
            @change="fetchReviews"
          />
        </UFormField>

        <UFormField label="Minimum Rating">
          <USelect
            v-model="filters.minRating"
            :options="ratingOptions"
            @change="fetchReviews"
          />
        </UFormField>

        <UFormField label="Search">
          <UInput
            v-model="filters.search"
            placeholder="Search reviews..."
            icon="i-heroicons-magnifying-glass"
            @input="debouncedSearch"
          />
        </UFormField>
      </div>
    </UCard>

    <!-- Reviews Table -->
    <UCard>
      <UTable
        :rows="reviews"
        :columns="columns"
        :loading="loading"
        :empty-state="{ icon: 'i-heroicons-star', label: 'No reviews found' }"
      >
        <template #rating-data="{ row }">
          <div class="flex items-center gap-1">
            <UIcon
              v-for="i in 5"
              :key="i"
              name="i-heroicons-star-solid"
              :class="i <= row.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
              class="h-4 w-4"
            />
            <span class="ml-1 text-sm text-gray-600 dark:text-gray-400">
              ({{ row.rating }})
            </span>
          </div>
        </template>

        <template #comment-data="{ row }">
          <p class="truncate max-w-xs">{{ row.comment }}</p>
        </template>

        <template #isHidden-data="{ row }">
          <UBadge :color="row.isHidden ? 'red' : 'green'">
            {{ row.isHidden ? 'Hidden' : 'Visible' }}
          </UBadge>
        </template>

        <template #createdAt-data="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>

        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton
              v-if="!row.isHidden"
              size="xs"
              color="red"
              @click="openHideModal(row)"
            >
              Hide
            </UButton>
            <UButton
              v-else
              size="xs"
              color="green"
              @click="unhideReview(row)"
            >
              Unhide
            </UButton>
            <UButton
              size="xs"
              color="gray"
              icon="i-heroicons-eye"
              @click="viewDetails(row)"
            >
              View
            </UButton>
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Hide Review Modal -->
    <UModal v-model="showHideModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-medium">Hide Review</h3>
        </template>

        <div class="space-y-4">
          <div v-if="selectedReview">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Review: {{ selectedReview.comment }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Rating: {{ selectedReview.rating }}/5
            </p>
          </div>

          <UFormField label="Reason for hiding" required>
            <UTextarea
              v-model="hideReason"
              placeholder="Enter reason for hiding this review..."
              :rows="3"
            />
          </UFormField>

          <UAlert
            color="amber"
            variant="soft"
            title="Warning"
            description="Hidden reviews will not be visible to users but will remain in the system."
          />
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="gray"
              variant="ghost"
              @click="closeHideModal"
            >
              Cancel
            </UButton>
            <UButton
              color="red"
              @click="hideReview"
              :loading="hiding"
              :disabled="!hideReason"
            >
              Hide Review
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Review Details Modal -->
    <UModal v-model="showDetailsModal" :ui="{ width: 'max-w-2xl' }">
      <UCard>
        <template #header>
          <h3 class="text-lg font-medium">Review Details</h3>
        </template>

        <div v-if="selectedReview" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Review ID</p>
              <p class="font-mono text-sm">{{ selectedReview._id }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Transaction ID</p>
              <p class="font-mono text-sm">{{ selectedReview.transactionId }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Rating</p>
              <div class="flex items-center gap-1">
                <UIcon
                  v-for="i in 5"
                  :key="i"
                  name="i-heroicons-star-solid"
                  :class="i <= selectedReview.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                  class="h-5 w-5"
                />
              </div>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <UBadge :color="selectedReview.isHidden ? 'red' : 'green'">
                {{ selectedReview.isHidden ? 'Hidden' : 'Visible' }}
              </UBadge>
            </div>
            <div class="col-span-2">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Comment</p>
              <p class="text-sm">{{ selectedReview.comment }}</p>
            </div>
            <div v-if="selectedReview.isHidden && selectedReview.hiddenReason" class="col-span-2">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Hidden Reason</p>
              <p class="text-sm">{{ selectedReview.hiddenReason }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Created At</p>
              <p>{{ formatDate(selectedReview.createdAt) }}</p>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton
              color="gray"
              variant="ghost"
              @click="showDetailsModal = false"
            >
              Close
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Error Alert -->
    <UAlert
      v-if="error"
      color="red"
      variant="soft"
      :title="error"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link' }"
      @close="error = ''"
    />
  </div>
</template>

<script setup lang="ts">
import type { Review } from '~/types/api'
import dayjs from 'dayjs'

const api = useApi()

const reviews = ref<Review[]>([])
const loading = ref(false)
const error = ref('')

const filters = ref({
  isHidden: '',
  minRating: '',
  search: ''
})

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Visible Only', value: 'false' },
  { label: 'Hidden Only', value: 'true' }
]

const ratingOptions = [
  { label: 'All Ratings', value: '' },
  { label: '1+ Stars', value: '1' },
  { label: '2+ Stars', value: '2' },
  { label: '3+ Stars', value: '3' },
  { label: '4+ Stars', value: '4' },
  { label: '5 Stars', value: '5' }
]

const columns = [
  { key: 'rating', label: 'Rating', id: 'rating' },
  { key: 'comment', label: 'Comment', id: 'comment' },
  { key: 'isHidden', label: 'Status', id: 'isHidden' },
  { key: 'createdAt', label: 'Created', id: 'createdAt' },
  { key: 'actions', label: 'Actions', id: 'actions' }
]

// Hide modal state
const showHideModal = ref(false)
const selectedReview = ref<Review | null>(null)
const hideReason = ref('')
const hiding = ref(false)

// Details modal state
const showDetailsModal = ref(false)

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

const fetchReviews = async () => {
  loading.value = true
  error.value = ''

  try {
    const params: Record<string, any> = {}
    if (filters.value.isHidden) params.isHidden = filters.value.isHidden
    if (filters.value.minRating) params.minRating = filters.value.minRating
    if (filters.value.search) params.search = filters.value.search

    const response = await api.getReviews(params)
    reviews.value = response.data
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load reviews'
    console.error('Failed to fetch reviews:', err)
  } finally {
    loading.value = false
  }
}

const openHideModal = (review: Review) => {
  selectedReview.value = review
  hideReason.value = ''
  showHideModal.value = true
}

const closeHideModal = () => {
  showHideModal.value = false
  selectedReview.value = null
  hideReason.value = ''
}

const hideReview = async () => {
  if (!selectedReview.value || !hideReason.value) return

  hiding.value = true
  error.value = ''

  try {
    await api.hideReview(selectedReview.value._id, hideReason.value)

    closeHideModal()
    await fetchReviews()

    // Show success notification
    const toast = useToast()
    toast.add({
      title: 'Success',
      description: 'Review hidden successfully',
      color: 'green'
    })
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to hide review'
    console.error('Failed to hide review:', err)
  } finally {
    hiding.value = false
  }
}

const unhideReview = async (review: Review) => {
  error.value = ''

  try {
    await api.unhideReview(review._id)
    await fetchReviews()

    // Show success notification
    const toast = useToast()
    toast.add({
      title: 'Success',
      description: 'Review unhidden successfully',
      color: 'green'
    })
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to unhide review'
    console.error('Failed to unhide review:', err)
  }
}

const viewDetails = (review: Review) => {
  selectedReview.value = review
  showDetailsModal.value = true
}

let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchReviews()
  }, 500)
}

onMounted(() => {
  fetchReviews()
})
</script>
