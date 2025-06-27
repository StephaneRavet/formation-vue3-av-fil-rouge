<template>
  <div class="modal-example">
    <h2>Exemples d'utilisation du composant Modal</h2>
    
    <!-- Boutons pour ouvrir les différentes modals -->
    <div class="button-group">
      <button @click="showBasicModal = true" class="btn btn-primary">
        Modal basique
      </button>
      
      <button @click="showCompleteModal = true" class="btn btn-secondary">
        Modal complète
      </button>
      
      <button @click="showCustomModal = true" class="btn btn-success">
        Modal personnalisée
      </button>
    </div>

    <!-- Modal basique avec seulement le contenu -->
    <Modal v-model="showBasicModal">
      <h3>Modal basique</h3>
      <p>Ceci est une modal simple avec seulement du contenu dans le slot par défaut.</p>
      <p>Vous pouvez la fermer en cliquant sur l'overlay ou en appuyant sur Échap.</p>
    </Modal>

    <!-- Modal complète avec header et footer -->
    <Modal 
      v-model="showCompleteModal"
      @close="onModalClose"
    >
      <template #header>
        <h3>Titre de la modal</h3>
      </template>

      <p>Contenu principal de la modal avec header et footer.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

      <template #footer>
        <button @click="showCompleteModal = false" class="btn btn-secondary">
          Annuler
        </button>
        <button @click="handleSave" class="btn btn-primary">
          Sauvegarder
        </button>
      </template>
    </Modal>

    <!-- Modal personnalisée avec options -->
    <Modal 
      v-model="showCustomModal"
      :close-on-overlay="false"
      :show-close-button="false"
    >
      <template #header>
        <div class="custom-header">
          <span class="icon">⚠️</span>
          <h3>Confirmation requise</h3>
        </div>
      </template>

      <div class="custom-content">
        <p>Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?</p>
        <div class="warning-box">
          <strong>Attention :</strong> Cette modal ne peut être fermée qu'avec les boutons ci-dessous.
        </div>
      </div>

      <template #footer>
        <button @click="showCustomModal = false" class="btn btn-outline">
          Non, annuler
        </button>
        <button @click="handleConfirm" class="btn btn-danger">
          Oui, confirmer
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Modal from './Modal.vue'

// Reactive refs for modal visibility
const showBasicModal = ref(false)
const showCompleteModal = ref(false)
const showCustomModal = ref(false)

// Event handlers
const onModalClose = () => {
  console.log('Modal fermée')
}

const handleSave = () => {
  console.log('Sauvegarde effectuée')
  showCompleteModal.value = false
}

const handleConfirm = () => {
  console.log('Action confirmée')
  showCustomModal.value = false
  alert('Action confirmée avec succès !')
}
</script>

<style scoped>
.modal-example {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-success {
  background-color: #10b981;
  color: white;
}

.btn-success:hover {
  background-color: #059669;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.btn-outline {
  background-color: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-outline:hover {
  background-color: #f9fafb;
}

.custom-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.custom-header .icon {
  font-size: 1.5rem;
}

.custom-content .warning-box {
  background-color: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 4px;
  padding: 1rem;
  margin-top: 1rem;
}

.custom-content .warning-box strong {
  color: #92400e;
}
</style> 