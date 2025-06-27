<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'
import { usePerformanceMode } from './composables/usePerformanceMode'
import Modal from './components/Modal.vue'

const router = useRouter()
const auth = useAuth()
const performance = usePerformanceMode()

// Initialize auth on mount
onMounted(() => {
  auth.initializeAuth()
})

// Navigation items
const navigationItems = [
  {
    title: 'Accueil',
    to: '/',
    icon: 'mdi-home'
  },
  {
    title: 'Produit',
    to: '/product/123',
    icon: 'mdi-package-variant'
  },
  {
    title: 'Dashboard',
    to: '/dashboard',
    icon: 'mdi-view-dashboard'
  },
  {
    title: 'Profiles',
    to: '/profiles',
    icon: 'mdi-pencil'
  },
  {
    title: 'Admin',
    to: '/admin',
    icon: 'mdi-shield-account'
  }
]

// Modal demonstration
const showModal = ref(false)

// Current route for highlighting active navigation - optimized
const currentRoute = ref(router.currentRoute.value.path)

// Update route efficiently
router.afterEach((to) => {
  currentRoute.value = to.path
})

// Quick login for testing
const quickLogin = () => {
  auth.login({
    email: 'test@example.com',
    name: 'Utilisateur Test',
    role: 'user'
  })
}

const quickLogout = () => {
  auth.logout()
}

// Computed pour la démonstration - maintenant sans erreur
const demoComputed = computed(() => {
  return 'Démonstration réussie'
})
</script>

<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Vue 3 App avec Modal Teleport</v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <!-- Navigation Menu -->
      <v-btn
        v-for="item in navigationItems"
        :key="item.to"
        :to="item.to"
        variant="text"
        :prepend-icon="item.icon"
        class="mx-1"
        :class="{ 'router-link-active': currentRoute === item.to }"
      >
        {{ item.title }}
      </v-btn>
      
      <!-- Performance Mode Toggle -->
      <v-divider vertical class="mx-2"></v-divider>
      <v-tooltip bottom>
        <template #activator="{ props }">
          <v-switch
            v-bind="props"
            v-model="performance.isVOnceEnabled.value"
            @change="performance.toggleVOnce"
            color="success"
            hide-details
            density="compact"
            class="mr-2"
            label="v-once"
          ></v-switch>
        </template>
        <span>Activer/Désactiver v-once</span>
      </v-tooltip>
      
      <v-tooltip bottom>
        <template #activator="{ props }">
          <v-switch
            v-bind="props"
            v-model="performance.isVMemoEnabled.value"
            @change="performance.toggleVMemo"
            color="info"
            hide-details
            density="compact"
            class="mr-2"
            label="v-memo"
          ></v-switch>
        </template>
        <span>Activer/Désactiver v-memo</span>
      </v-tooltip>

      <!-- Quick Auth Buttons for Testing -->
      <v-divider vertical class="mx-2"></v-divider>
      <v-btn
        v-if="!auth.isAuthenticated.value"
        @click="quickLogin"
        variant="outlined"
        color="white"
        size="small"
        prepend-icon="mdi-login"
      >
        Test Login
      </v-btn>
      <v-btn
        v-else
        @click="quickLogout"
        variant="outlined"
        color="white"
        size="small"
        prepend-icon="mdi-logout"
      >
        {{ auth.user.value?.name }} - Logout
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-6">
        <!-- Modal Component Demo with Teleport - Only on Home page -->
        <v-row v-if="currentRoute === '/'">
          <v-col cols="12">
            <!-- Affichage de la démonstration -->
            <div>{{ demoComputed }}</div>
            
            <v-card class="pa-6" elevation="3">
              <v-card-title class="text-h4 text-center mb-4">
                🚀 Démonstration Modal avec Teleport & Focus Trap
              </v-card-title>
              
              <v-card-text>
                <p class="text-body-1 mb-4">Cette modal utilise :</p>
                <v-list>
                  <v-list-item>
                    <template #prepend>
                      <v-icon color="primary">mdi-export</v-icon>
                    </template>
                    <v-list-item-title><strong>Teleport</strong> : Rendue dans #teleport-root</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon color="success">mdi-keyboard</v-icon>
                    </template>
                    <v-list-item-title><strong>Focus Trap</strong> : Focus confiné dans la modal</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon color="info">mdi-tab</v-icon>
                    </template>
                    <v-list-item-title><strong>Navigation</strong> : Tab/Shift+Tab pour naviguer</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon color="warning">mdi-keyboard-esc</v-icon>
                    </template>
                    <v-list-item-title><strong>Échappement</strong> : Échap pour fermer</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
              
              <v-card-actions class="justify-center">
                <v-btn 
                  @click="showModal = true"
                  color="primary"
                  size="large"
                  prepend-icon="mdi-window-maximize"
                  class="mr-4"
                >
                  Ouvrir la Modal
                </v-btn>
                
                <!-- Bouton d'information -->
                <v-btn 
                  @click="showModal = true"
                  color="success"
                  size="large"
                  prepend-icon="mdi-information"
                  variant="outlined"
                >
                  ℹ️ Plus d'info
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        
        <!-- Router View for all pages -->
        <router-view />
      </v-container>
    </v-main>

    <!-- Modal with Teleport - will be rendered in #teleport-root -->
    <Teleport to="#teleport-root">
      <Modal
        v-model:modelValue="showModal"
        :closeOnOverlay="true"
        :closeOnEscape="true"
        :showCloseButton="true"
      >
        <template #header>
          <h2>🎯 Modal avec Teleport et Focus Trap</h2>
        </template>
        
        <div class="modal-demo-content">
          <p>Cette modal démontre l'utilisation de :</p>
          <ul>
            <li><strong>Teleport :</strong> Le contenu est rendu dans #teleport-root</li>
            <li><strong>Focus trap :</strong> Naviguez avec Tab - le focus reste dans la modal</li>
            <li><strong>Accessibilité :</strong> Support complet du clavier</li>
          </ul>
          
          <div class="form-demo">
            <label for="demo-input">Champ de test :</label>
            <input id="demo-input" type="text" placeholder="Tapez quelque chose..." />
            
            <label for="demo-select">Liste déroulante :</label>
            <select id="demo-select">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
            
            <textarea placeholder="Zone de texte..." rows="3"></textarea>
          </div>
        </div>

        <template #footer>
          <button @click="showModal = false" class="btn-secondary">
            Annuler
          </button>
          <button @click="showModal = false" class="btn-primary">
            Confirmer
          </button>
        </template>
      </Modal>
    </Teleport>
  </v-app>
</template>

<style scoped>
/* Navigation styles */
.router-link-active {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

/* Modal demo styles */
.modal-demo-content {
  line-height: 1.6;
}

.modal-demo-content ul {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.modal-demo-content li {
  margin: 0.5rem 0;
}

.form-demo {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-demo label {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.form-demo input,
.form-demo select,
.form-demo textarea {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
}

.form-demo input:focus,
.form-demo select:focus,
.form-demo textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn-primary,
.btn-secondary {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  margin-right: 0.5rem;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}
</style>
