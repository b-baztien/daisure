export interface Bank {
  _id: string
  name: string
  uniqueId: string
  isEnable: boolean
}

export const useBanks = () => {
  const { apiFetch } = useApi()
  const banks = useState<Bank[]>('banks', () => [])
  const isLoading = useState<boolean>('banks-loading', () => false)

  const fetchBanks = async () => {
    if (banks.value.length > 0) {
      return banks.value
    }

    isLoading.value = true
    try {
      const response = await apiFetch<Bank[]>('/banks', {
        method: 'GET'
      })
      banks.value = response
      return response
    } catch (error) {
      console.error('Failed to fetch banks:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    banks: computed(() => banks.value),
    isLoading: computed(() => isLoading.value),
    fetchBanks
  }
}
