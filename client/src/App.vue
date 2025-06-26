<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'

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
</style>
