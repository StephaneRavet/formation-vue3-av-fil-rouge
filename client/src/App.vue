<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'
import Accordion from './components/Accordion.vue'

const router = useRouter()
const auth = useAuth()

// Initialiser l'authentification au montage du composant
onMounted(() => {
  auth.initializeAuth()
})

// Navigation items basés sur l'état d'authentification
const navigationItems = computed(() => {
  const items = [
    {
      title: 'Accueil',
      to: '/',
      icon: 'mdi-home',
      public: true
    },
    {
      title: 'Produit',
      to: '/product/123',
      icon: 'mdi-package-variant',
      public: true
    }
  ]

  if (auth.isAuthenticated.value) {
    items.push(
      {
        title: 'Profil',
        to: '/profile',
        icon: 'mdi-account',
        auth: true
      },
      {
        title: 'Dashboard',
        to: '/dashboard',
        icon: 'mdi-view-dashboard',
        auth: true
      },
      {
        title: 'Éditeur',
        to: '/editor',
        icon: 'mdi-pencil',
        auth: true
      }
    )

    if (auth.hasRole('admin')) {
      items.push({
        title: 'Administration',
        to: '/admin',
        icon: 'mdi-shield-account',
        admin: true
      })
    }
  } else {
    items.push({
      title: 'Connexion',
      to: '/login',
      icon: 'mdi-login',
      public: true
    })
  }

  return items
})

const testError = () => {
  router.push('/existe-pas')
}

const logout = () => {
  auth.logout()
  router.push('/login')
}

// Sample data for Accordion component demonstration
const accordionItems = ref([
  {
    title: 'Qu\'est-ce que Vue 3 ?',
    content: 'Vue 3 est la dernière version majeure du framework JavaScript Vue.js. Elle apporte de nombreuses améliorations en termes de performance, de composition API, et de TypeScript support.'
  },
  {
    title: 'Qu\'est-ce qu\'un Scoped Slot ?',
    content: 'Un scoped slot permet au composant parent de recevoir des données du composant enfant. C\'est un moyen puissant de personnaliser le rendu tout en gardant la logique dans le composant enfant.'
  },
  {
    title: 'Comment utiliser la Composition API ?',
    content: 'La Composition API permet d\'organiser le code de composant par fonctionnalité logique plutôt que par type d\'option. Utilisez setup() ou <script setup> pour en profiter.'
  },
  {
    title: 'Avantages de Vuetify',
    content: 'Vuetify est une bibliothèque de composants Material Design pour Vue.js qui fournit une collection complète de composants pré-construits et stylés.'
  }
])
</script>

<template>
  <v-app>
    <!-- Menu de navigation -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Mon Application Vue 3</v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <!-- Menu de navigation -->
      <v-btn
        v-for="item in navigationItems"
        :key="item.to"
        :to="item.to"
        variant="text"
        :prepend-icon="item.icon"
        class="mx-1"
      >
        {{ item.title }}
      </v-btn>
      
      <!-- Informations utilisateur et déconnexion -->
      <div v-if="auth.isAuthenticated.value" class="user-info">
        <v-chip 
          :color="auth.role.value === 'admin' ? 'success' : 'info'"
          class="ma-2"
        >
          {{ auth.user.value?.name }} ({{ auth.role.value }})
        </v-chip>
        <v-btn
          @click="logout"
          variant="outlined"
          prepend-icon="mdi-logout"
          class="ma-1"
        >
          Déconnexion
        </v-btn>
      </div>
    </v-app-bar>

    <!-- Contenu principal -->
    <v-main>
      <v-container>
        <!-- Indicateur de debug -->
        <div class="debug-panel">
          <v-chip size="small" color="warning" class="ma-1">
            Debug - État Auth: {{ auth.isAuthenticated.value ? 'Connecté' : 'Déconnecté' }}
          </v-chip>
          <v-chip v-if="auth.isAuthenticated.value" size="small" color="info" class="ma-1">
            Rôle: {{ auth.role.value }}
          </v-chip>
          <v-btn size="small" @click="testError" color="error" variant="outlined" class="ma-1">
            Test Error
          </v-btn>
        </div>
        
        <!-- Accordion Component Demo -->
        <v-row class="ma-4">
          <v-col cols="12">
            <h2 class="mb-4">💻 Démonstration du composant Accordion avec Scoped Slots</h2>
            
            <Accordion :items="accordionItems" :multiple="true">
              <!-- Custom header slot with scoped data -->
              <template #header="{ item, index, isOpen }">
                <div class="custom-header">
                  <v-icon 
                    :color="isOpen ? 'primary' : 'grey'" 
                    class="mr-3"
                  >
                    mdi-help-circle
                  </v-icon>
                  <span class="header-title" :class="{ 'text-primary': isOpen }">
                    {{ item.title }}
                  </span>
                  <v-chip 
                    size="small" 
                    :color="isOpen ? 'success' : 'default'"
                    class="ml-auto mr-3"
                  >
                    {{ isOpen ? 'Ouvert' : 'Fermé' }}
                  </v-chip>
                </div>
              </template>
              
              <!-- Custom content slot (optional) -->
              <template #content="{ item, index }">
                <v-card flat class="custom-content">
                  <v-card-text>
                    {{ item.content }}
                  </v-card-text>
                  <v-card-actions>
                    <v-btn 
                      variant="outlined" 
                      size="small"
                      prepend-icon="mdi-information"
                    >
                      En savoir plus
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </Accordion>
          </v-col>
        </v-row>
        
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
/* Styles personnalisés pour l'application */
.v-btn.router-link-active {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.user-info {
  display: flex;
  align-items: center;
}

.debug-panel {
  position: fixed;
  top: 80px;
  right: 16px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Custom styles for Accordion demo */
.custom-header {
  display: flex;
  align-items: center;
  width: 100%;
}

.header-title {
  font-weight: 500;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.custom-content {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}
</style>
