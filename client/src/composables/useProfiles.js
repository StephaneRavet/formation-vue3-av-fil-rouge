import { ref, computed } from 'vue'

const profiles = ref([])
const loading = ref(false)
const error = ref(null)
const searchFilter = ref('')
const lastUpdated = ref(null)

export function useProfiles() {
  // Fetch all profiles from API
  const fetchProfiles = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch('http://localhost:3001/api/profiles')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      profiles.value = data
      lastUpdated.value = new Date()
    } catch (err) {
      error.value = err.message
      console.error('Error fetching profiles:', err)
    } finally {
      loading.value = false
    }
  }

  // Computed filtered profiles based on search
  const filteredProfiles = computed(() => {
    if (!searchFilter.value) return profiles.value
    
    const filter = searchFilter.value.toLowerCase()
    return profiles.value.filter(profile => 
      profile.firstName.toLowerCase().includes(filter) ||
      profile.lastName.toLowerCase().includes(filter) ||
      profile.email.toLowerCase().includes(filter) ||
      (profile.bio && profile.bio.toLowerCase().includes(filter))
    )
  })

  // Update search filter
  const setSearchFilter = (filter) => {
    searchFilter.value = filter
  }

  // Clear search filter
  const clearSearchFilter = () => {
    searchFilter.value = ''
  }

  // Simulate heavy computation for demo purposes
  const expensiveProfileComputation = (profile) => {
    // Simulate CPU-intensive task
    let result = 0
    for (let i = 0; i < 10000; i++) {
      result += Math.sin(profile.id * i) * Math.cos(i)
    }
    return result
  }

  return {
    profiles: computed(() => profiles.value),
    filteredProfiles,
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    searchFilter: computed(() => searchFilter.value),
    lastUpdated: computed(() => lastUpdated.value),
    fetchProfiles,
    setSearchFilter,
    clearSearchFilter,
    expensiveProfileComputation
  }
} 