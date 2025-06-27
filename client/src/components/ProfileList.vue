<template>
  <div class="profile-list-container">

    <!-- Controls section -->
    <div class="controls">
      <div class="search-section">
        <label for="search">Rechercher :</label>
        <input
          id="search"
          v-model="searchFilter"
          type="text"
          placeholder="Nom, email, ou bio..."
          class="search-input"
          @input="handleSearchInput"
        />
        <button v-if="searchFilter" @click="clearSearch" class="clear-btn">
          Effacer
        </button>
      </div>
      
      <div class="actions">
        <button @click="refreshProfiles" :disabled="loading" class="refresh-btn">
          {{ loading ? 'Chargement...' : 'Actualiser' }}
        </button>
        <button @click="togglePerformanceMode" class="performance-btn">
          {{ (performance.isVOnceEnabled.value && performance.isVMemoEnabled.value) ? 'Désactiver' : 'Activer' }} Performance
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Chargement des profils...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error">
      <p>Erreur : {{ error }}</p>
      <button @click="refreshProfiles" class="retry-btn">Réessayer</button>
    </div>

    <!-- Table header with v-once optimization -->
    <div v-else-if="filteredProfiles.length > 0" class="table-container">
      <table class="profiles-table">
        <thead :v-once="performance.vOnceDirective.value">
          <tr>
            <th>Avatar</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Bio</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Profile rows with v-memo optimization -->
          <tr
            v-for="profile in filteredProfiles"
            :key="profile.id"
            :v-memo="performance.getMemoKey(profile.id, profile.firstName, profile.lastName, profile.email, searchFilter)"
            class="profile-row"
            :class="{ 'highlighted': isProfileHighlighted(profile) }"
          >
            <td class="avatar-cell">
              <img
                :src="profile.avatar || '/placeholder-avatar.png'"
                :alt="`Avatar de ${profile.firstName} ${profile.lastName}`"
                class="avatar"
                @error="handleImageError"
              />
            </td>
            <td class="name-cell">
              <div class="name-container">
                <span class="full-name">{{ profile.firstName }} {{ profile.lastName }}</span>
                <small class="birth-date">{{ formatBirthDate(profile.birthDate) }}</small>
              </div>
            </td>
            <td class="email-cell">
              <a :href="`mailto:${profile.email}`" class="email-link">
                {{ profile.email }}
              </a>
            </td>
            <td class="phone-cell">
              {{ profile.phone || 'N/A' }}
            </td>
            <td class="bio-cell">
              <div class="bio-content">
                {{ truncateBio(profile.bio) }}
              </div>
            </td>
            <td class="actions-cell">
              <button @click="viewProfile(profile)" class="action-btn view-btn">
                Voir
              </button>
              <button @click="editProfile(profile)" class="action-btn edit-btn">
                Éditer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <p>Aucun profil trouvé</p>
      <button v-if="searchFilter" @click="clearSearch" class="clear-filter-btn">
        Effacer le filtre
      </button>
    </div>

    <!-- Performance info -->
    <div class="performance-info">
      <h3 :v-once="performance.vOnceDirective.value">Informations de Performance</h3>
      <ul>
        <li><strong>v-once appliqué sur :</strong> titre, en-têtes de tableau, labels statiques</li>
        <li><strong>v-memo appliqué sur :</strong> lignes de profils (dépendances: id, nom, email, filtre)</li>
        <li><strong>v-once :</strong> {{ performance.isVOnceEnabled.value ? 'Activé' : 'Désactivé' }}</li>
        <li><strong>v-memo :</strong> {{ performance.isVMemoEnabled.value ? 'Activé' : 'Désactivé' }}</li>
        <li><strong>Nombre de re-renders évités :</strong> {{ performance.renderSavings.value }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useProfiles } from '../composables/useProfiles'
import { usePerformanceMode } from '../composables/usePerformanceMode'

// Composable usage
const {
  profiles,
  filteredProfiles,
  loading,
  error,
  searchFilter,
  lastUpdated,
  fetchProfiles,
  setSearchFilter,
  clearSearchFilter,
  expensiveProfileComputation
} = useProfiles()

// Performance mode global
const performance = usePerformanceMode()

// Computed properties
const formatLastUpdated = computed(() => {
  if (!lastUpdated.value) return 'Jamais'
  return lastUpdated.value.toLocaleString('fr-FR')
})

// Methods
const handleSearchInput = (event) => {
  setSearchFilter(event.target.value)
}

const clearSearch = () => {
  clearSearchFilter()
}

const refreshProfiles = () => {
  fetchProfiles()
}

const togglePerformanceMode = () => {
  performance.toggleBothModes()
}

const isProfileHighlighted = (profile) => {
  if (!searchFilter.value) return false
  const filter = searchFilter.value.toLowerCase()
  return profile.firstName.toLowerCase().includes(filter) ||
         profile.lastName.toLowerCase().includes(filter) ||
         profile.email.toLowerCase().includes(filter)
}

const formatBirthDate = (birthDate) => {
  if (!birthDate) return ''
  return new Date(birthDate).toLocaleDateString('fr-FR')
}

const truncateBio = (bio) => {
  if (!bio) return 'Aucune bio'
  return bio.length > 100 ? bio.substring(0, 100) + '...' : bio
}

const viewProfile = (profile) => {
  console.log('Viewing profile:', profile)
  // Here you would typically navigate to a profile detail page
  alert(`Voir le profil de ${profile.firstName} ${profile.lastName}`)
}

const editProfile = (profile) => {
  console.log('Editing profile:', profile)
  // Here you would typically open an edit modal or navigate to edit page
  alert(`Éditer le profil de ${profile.firstName} ${profile.lastName}`)
}

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyOEMyNC40MTgzIDI4IDI4IDI0LjQxODMgMjggMjBDMjggMTUuNTgxNyAyNC40MTgzIDEyIDIwIDEyQzE1LjU4MTcgMTIgMTIgMTUuNTgxNyAxMiAyMEMxMiAyNC40MTgzIDE1LjU4MTcgMjggMjAgMjhaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='
}

// Watch for filter changes to simulate render savings
watch(searchFilter, () => {
  if (performance.isVOnceEnabled.value || performance.isVMemoEnabled.value) {
    performance.incrementRenderSavings(Math.floor(Math.random() * 5) + 1)
  }
})

// Lifecycle
onMounted(() => {
  fetchProfiles()
})
</script>

<style scoped>
.profile-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header styles */
.header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.title {
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  font-weight: 700;
}

.subtitle {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
}

/* Controls styles */
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  gap: 20px;
}

.search-section {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.search-input {
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 16px;
  min-width: 300px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.actions {
  display: flex;
  gap: 10px;
}

.clear-btn, .refresh-btn, .performance-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn {
  background: #dc3545;
  color: white;
}

.refresh-btn {
  background: #28a745;
  color: white;
}

.performance-btn {
  background: #17a2b8;
  color: white;
}

.clear-btn:hover, .refresh-btn:hover, .performance-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.refresh-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}

/* Stats styles */
.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #495057;
}

/* Loading styles */
.loading {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Table styles */
.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.profiles-table {
  width: 100%;
  border-collapse: collapse;
}

.profiles-table th {
  background: #495057;
  color: white;
  padding: 15px;
  text-align: left;
  font-weight: 600;
}

.profile-row {
  border-bottom: 1px solid #e9ecef;
  transition: background-color 0.2s;
}

.profile-row:hover {
  background-color: #f8f9fa;
}

.profile-row.highlighted {
  background-color: #fff3cd;
}

.profiles-table td {
  padding: 15px;
  vertical-align: middle;
}

/* Cell specific styles */
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
}

.name-container {
  display: flex;
  flex-direction: column;
}

.full-name {
  font-weight: 600;
  color: #495057;
}

.birth-date {
  color: #6c757d;
  font-size: 12px;
}

.email-link {
  color: #007bff;
  text-decoration: none;
}

.email-link:hover {
  text-decoration: underline;
}

.bio-content {
  max-width: 200px;
  font-size: 14px;
  color: #6c757d;
  line-height: 1.4;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn {
  background: #17a2b8;
  color: white;
}

.edit-btn {
  background: #ffc107;
  color: #212529;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

.clear-filter-btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
}

/* Error state */
.error {
  text-align: center;
  padding: 40px;
  color: #dc3545;
}

.retry-btn {
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
}

/* Performance info */
.performance-info {
  margin-top: 30px;
  padding: 20px;
  background: #e9ecef;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.performance-info h3 {
  margin-top: 0;
  color: #495057;
}

.performance-info ul {
  margin: 15px 0 0 0;
  padding-left: 20px;
}

.performance-info li {
  margin-bottom: 8px;
  color: #495057;
}

/* Responsive design */
@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-section {
    justify-content: center;
  }
  
  .search-input {
    min-width: 100%;
  }
  
  .stats {
    flex-direction: column;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .profiles-table {
    min-width: 700px;
  }
}
</style> 