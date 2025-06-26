<template>
  <div class="editor-view">
    <h1>Éditeur de Contenu</h1>
    
    <div class="editor-toolbar">
      <button @click="save" :disabled="!hasUnsavedChanges" class="save-btn">
        Sauvegarder
      </button>
      <button @click="reset" class="reset-btn">
        Réinitialiser
      </button>
      <div v-if="hasUnsavedChanges" class="unsaved-indicator">
        ⚠️ Modifications non sauvegardées
      </div>
    </div>
    
    <div class="editor-content">
      <div class="form-group">
        <label for="title">Titre :</label>
        <input
          type="text"
          id="title"
          v-model="content.title"
          @input="markAsModified"
          placeholder="Titre de votre contenu"
        />
      </div>
      
      <div class="form-group">
        <label for="content">Contenu :</label>
        <textarea
          id="content"
          v-model="content.body"
          @input="markAsModified"
          placeholder="Écrivez votre contenu ici..."
          rows="15"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="tags">Tags :</label>
        <input
          type="text"
          id="tags"
          v-model="content.tags"
          @input="markAsModified"
          placeholder="tag1, tag2, tag3"
        />
      </div>
    </div>
    
    <div class="editor-stats">
      <p>Mots : {{ wordCount }}</p>
      <p>Caractères : {{ characterCount }}</p>
      <p>Dernière sauvegarde : {{ lastSaved || 'Jamais' }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

// État du contenu
const content = reactive({
  title: '',
  body: '',
  tags: ''
})

// État de l'éditeur
const hasUnsavedChanges = ref(false)
const lastSaved = ref(null)
const originalContent = ref('')

// Computed properties
const wordCount = computed(() => {
  return content.body.trim().split(/\s+/).filter(word => word.length > 0).length
})

const characterCount = computed(() => {
  return content.body.length
})

// Marquer comme modifié
function markAsModified() {
  hasUnsavedChanges.value = true
}

// Sauvegarder le contenu
async function save() {
  try {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    hasUnsavedChanges.value = false
    lastSaved.value = new Date().toLocaleString('fr-FR')
    originalContent.value = JSON.stringify(content)
    
    // Afficher un message de succès
    alert('Contenu sauvegardé avec succès!')
    
  } catch (error) {
    alert('Erreur lors de la sauvegarde')
  }
}

// Réinitialiser le contenu
function reset() {
  if (hasUnsavedChanges.value) {
    const confirmed = confirm('Êtes-vous sûr de vouloir réinitialiser ? Toutes les modifications non sauvegardées seront perdues.')
    if (!confirmed) return
  }
  
  content.title = ''
  content.body = ''
  content.tags = ''
  hasUnsavedChanges.value = false
}

// Garde de navigation pour prévenir la perte de modifications
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    const answer = window.confirm(
      'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter cette page ? Toutes les modifications seront perdues.'
    )
    if (answer) {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})

// Watcher pour détecter les changements automatiquement
watch(content, () => {
  if (originalContent.value && JSON.stringify(content) !== originalContent.value) {
    hasUnsavedChanges.value = true
  }
}, { deep: true })

// Initialiser le contenu original
originalContent.value = JSON.stringify(content)
</script>

<style scoped>
.editor-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.save-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn:hover:not(:disabled) {
  background: #218838;
}

.save-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.reset-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.reset-btn:hover {
  background: #c82333;
}

.unsaved-indicator {
  color: #856404;
  background: #fff3cd;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.editor-content {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
  min-height: 200px;
}

.editor-stats {
  background: #e9ecef;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  gap: 2rem;
}

.editor-stats p {
  margin: 0;
  font-size: 0.9rem;
  color: #495057;
}
</style> 