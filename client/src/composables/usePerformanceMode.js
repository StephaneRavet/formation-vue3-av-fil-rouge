import { ref, computed } from 'vue'

// État global pour les modes de performance
const isVOnceEnabled = ref(true)
const isVMemoEnabled = ref(true)
const renderSavings = ref(0)

export function usePerformanceMode() {
  // Computed pour faciliter l'utilisation dans les templates
  const vOnceDirective = computed(() => isVOnceEnabled.value ? true : undefined)
  const vMemoDirective = computed(() => isVMemoEnabled.value)

  // Fonctions pour toggler les modes
  const toggleVOnce = () => {
    isVOnceEnabled.value = !isVOnceEnabled.value
    console.log(`v-once ${isVOnceEnabled.value ? 'activé' : 'désactivé'}`)
  }

  const toggleVMemo = () => {
    isVMemoEnabled.value = !isVMemoEnabled.value
    console.log(`v-memo ${isVMemoEnabled.value ? 'activé' : 'désactivé'}`)
  }

  const toggleBothModes = () => {
    const newState = !(isVOnceEnabled.value && isVMemoEnabled.value)
    isVOnceEnabled.value = newState
    isVMemoEnabled.value = newState
    renderSavings.value = 0
    console.log(`Modes de performance ${newState ? 'activés' : 'désactivés'}`)
  }

  // Fonction utilitaire pour v-memo
  const getMemoKey = (...dependencies) => {
    return isVMemoEnabled.value ? dependencies : undefined
  }

  // Fonction pour simuler des économies de rendu
  const incrementRenderSavings = (amount = 1) => {
    if (isVOnceEnabled.value || isVMemoEnabled.value) {
      renderSavings.value += amount
    }
  }

  return {
    // État
    isVOnceEnabled: computed(() => isVOnceEnabled.value),
    isVMemoEnabled: computed(() => isVMemoEnabled.value),
    renderSavings: computed(() => renderSavings.value),
    
    // Helpers pour templates
    vOnceDirective,
    vMemoDirective,
    
    // Actions
    toggleVOnce,
    toggleVMemo,
    toggleBothModes,
    getMemoKey,
    incrementRenderSavings
  }
} 