// Composable d'exemple avec logique complète
import { ref, computed } from 'vue'

export function useExample() {
  // État réactif
  const count = ref(0)
  const isActive = ref(false)

  // Computed
  const doubleCount = computed(() => count.value * 2)
  const status = computed(() => isActive.value ? 'Actif' : 'Inactif')

  // Méthodes
  const increment = () => {
    count.value++
  }

  const decrement = () => {
    count.value--
  }

  const toggle = () => {
    isActive.value = !isActive.value
  }

  const reset = () => {
    count.value = 0
    isActive.value = false
  }

  // API publique du composable
  return {
    // État
    count,
    isActive,
    
    // Computed
    doubleCount,
    status,
    
    // Méthodes
    increment,
    decrement,
    toggle,
    reset
  }
} 