import { ref, computed } from 'vue'

// État réactif global pour l'authentification
const isAuthenticated = ref(false)
const user = ref(null)
const role = ref(null)
const token = ref(null)

// Clés pour localStorage
const STORAGE_KEYS = {
  USER: 'auth_user',
  TOKEN: 'auth_token',
  ROLE: 'auth_role'
}

// Fonctions utilitaires pour localStorage
const storage = {
  get(key) {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch {
      return null
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Erreur lors de la sauvegarde en localStorage:', error)
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Erreur lors de la suppression en localStorage:', error)
    }
  },
  
  clear() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('Erreur lors du nettoyage en localStorage:', error)
    }
  }
}

// Initialiser l'état depuis localStorage
function initializeAuth() {
  const savedUser = storage.get(STORAGE_KEYS.USER)
  const savedToken = storage.get(STORAGE_KEYS.TOKEN)
  const savedRole = storage.get(STORAGE_KEYS.ROLE)
  
  if (savedUser && savedToken && savedRole) {
    isAuthenticated.value = true
    user.value = savedUser
    role.value = savedRole
    token.value = savedToken
  } else {
    // Nettoyer si les données sont incomplètes
    logout()
  }
}

// Connexion
function login(userData) {
  const userInfo = {
    name: userData.name || userData.email?.split('@')[0],
    email: userData.email,
    id: userData.id || Date.now()
  }
  
  const userRole = userData.role || 'user'
  const userToken = userData.token || `token-${Date.now()}`
  
  // Sauvegarder en localStorage
  storage.set(STORAGE_KEYS.USER, userInfo)
  storage.set(STORAGE_KEYS.ROLE, userRole)
  storage.set(STORAGE_KEYS.TOKEN, userToken)
  
  // Mettre à jour l'état réactif
  isAuthenticated.value = true
  user.value = userInfo
  role.value = userRole
  token.value = userToken
}

// Déconnexion
function logout() {
  // Nettoyer localStorage
  storage.clear()
  
  // Réinitialiser l'état réactif
  isAuthenticated.value = false
  user.value = null
  role.value = null
  token.value = null
}

// Vérifier si l'utilisateur a un rôle spécifique
function hasRole(requiredRole) {
  if (!role.value) return false
  return role.value === requiredRole || role.value === 'admin'
}

// Vérifier si l'utilisateur est connecté
function checkAuth() {
  const savedToken = storage.get(STORAGE_KEYS.TOKEN)
  return !!savedToken
}

// Obtenir les informations utilisateur depuis localStorage
function getUserFromStorage() {
  return {
    user: storage.get(STORAGE_KEYS.USER),
    role: storage.get(STORAGE_KEYS.ROLE),
    token: storage.get(STORAGE_KEYS.TOKEN),
    isAuthenticated: !!storage.get(STORAGE_KEYS.TOKEN)
  }
}

// Composable principal
export function useAuth() {
  return {
    // État réactif
    isAuthenticated: computed(() => isAuthenticated.value),
    user: computed(() => user.value),
    role: computed(() => role.value),
    token: computed(() => token.value),
    
    // Actions
    login,
    logout,
    hasRole,
    checkAuth,
    initializeAuth,
    getUserFromStorage
  }
}

// Fonctions utilitaires non réactives pour le routeur
export const authUtils = {
  isAuthenticated: () => checkAuth(),
  getRole: () => storage.get(STORAGE_KEYS.ROLE),
  hasRole: (requiredRole) => {
    const userRole = storage.get(STORAGE_KEYS.ROLE)
    if (!userRole) return false
    return userRole === requiredRole || userRole === 'admin'
  },
  getUserInfo: () => getUserFromStorage()
} 