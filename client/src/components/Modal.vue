<template>
  <div v-if="isVisible" ref="modalEl" class="modal-overlay" @click="closeOnOverlayClick">
    <div class="modal-container" @click.stop>
      <!-- Header avec slot nommé -->
      <div class="modal-header" v-if="$slots.header">
        <slot name="header"></slot>
        <button 
          v-if="showCloseButton" 
          class="modal-close-btn" 
          @click="closeModal"
          aria-label="Fermer la modal"
        >
          ×
        </button>
      </div>

      <!-- Body avec slot par défaut -->
      <div class="modal-body">
        <slot></slot>
      </div>

      <!-- Footer avec slot nommé -->
      <div class="modal-footer" v-if="$slots.footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

// Focus trap variables
const modalEl = ref(null)
const focusablesSelector = '[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  },
  closeOnEscape: {
    type: Boolean,
    default: true
  },
  showCloseButton: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'close'])

// Computed
const isVisible = computed(() => props.modelValue)

// Methods
const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

const closeOnOverlayClick = () => {
  if (props.closeOnOverlay) {
    closeModal()
  }
}

const handleEscapeKey = (event) => {
  if (event.key === 'Escape' && props.closeOnEscape && isVisible.value) {
    closeModal()
  }
}

// Optimized focus trap function
let focusableElements = []

function updateFocusableElements() {
  if (!modalEl.value) return
  focusableElements = Array.from(modalEl.value.querySelectorAll(focusablesSelector))
    .filter(el => !el.disabled && el.offsetWidth > 0 && el.offsetHeight > 0)
}

function trapFocus(event) {
  // Only trap focus when Tab key is pressed
  if (event.key !== 'Tab' || focusableElements.length === 0) return
  
  const first = focusableElements[0]
  const last = focusableElements[focusableElements.length - 1]
  
  if (event.shiftKey) {
    // Shift + Tab: if on first element, go to last
    if (document.activeElement === first) {
      event.preventDefault()
      last.focus()
    }
  } else {
    // Tab: if on last element, go to first
    if (document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}

// Optimized event listeners - only active when modal is visible
watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      // Add listeners when modal opens
      if (props.closeOnEscape) {
        document.addEventListener('keydown', handleEscapeKey)
      }
      document.addEventListener('keydown', trapFocus)
    } else {
      // Remove listeners when modal closes
      if (props.closeOnEscape) {
        document.removeEventListener('keydown', handleEscapeKey)
      }
      document.removeEventListener('keydown', trapFocus)
      // Clear focusable elements cache
      focusableElements = []
    }
  }
)

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  document.removeEventListener('keydown', trapFocus)
})

// Focus on first element when modal opens
watch(
  () => props.modelValue,
  async (visible) => {
    if (visible) {
      await nextTick()
      updateFocusableElements()
      if (focusableElements.length > 0) {
        focusableElements[0].focus()
      }
    }
  }
)
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  color: #1f2937;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 95vw;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9fafb;
  color: #111827;
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  margin-left: 1rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
}

.modal-close-btn:hover {
  background-color: #e5e7eb;
  color: #374151;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
  color: #374151;
  line-height: 1.6;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
  color: #374151;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Text elements styling for better readability */
.modal-container h1,
.modal-container h2,
.modal-container h3,
.modal-container h4,
.modal-container h5,
.modal-container h6 {
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.modal-container p {
  color: #374151;
  margin: 0 0 1rem 0;
}

.modal-container ul,
.modal-container ol {
  color: #374151;
  margin: 0 0 1rem 0;
  padding-left: 1.5rem;
}

.modal-container li {
  color: #374151;
  margin: 0.25rem 0;
}

.modal-container strong {
  color: #111827;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 640px) {
  .modal-container {
    margin: 1rem;
    max-width: calc(100vw - 2rem);
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
}
</style> 