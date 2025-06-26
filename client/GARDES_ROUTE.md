# Gardes de Route - Documentation

Ce document explique l'implémentation des gardes de route Vue Router dans ce projet avec gestion de l'authentification via localStorage.

## 🔐 Fonctionnalités Implémentées

### 1. Route `/profile` avec Meta `requiresAuth: true`

**Route configurée** : `/profile`
- **Composant** : `ProfileView.vue`
- **Meta** : `{ requiresAuth: true }`
- **Description** : Page de profil utilisateur accessible uniquement aux utilisateurs connectés

```javascript
{
  path: '/profile',
  name: 'Profile',
  component: ProfileView,
  meta: {
    requiresAuth: true, // ✅ Route protégée par authentification
  }
}
```

### 2. Garde Globale `beforeEach` pour l'Authentification

**Fichier** : `client/src/router/index.js`
- **Fonction** : Vérifie l'authentification avant chaque navigation via localStorage
- **Redirection** : Vers `/login` si non connecté et route protégée
- **Gestion** : Préservation de l'URL de destination dans les paramètres de requête

```javascript
router.beforeEach((to, from, next) => {
  // Vérifier si la route nécessite une authentification
  if (to.meta.requiresAuth) {
    if (!authUtils.isAuthenticated()) {
      // ✅ Redirection vers login avec l'URL de destination
      next(`/login?redirect=${to.path}`);
      return;
    }
  }
  
  next(); // Continuer la navigation
});
```

### 3. Garde de Route `beforeEnter` sur `/admin` avec Vérification de Rôle

**Route configurée** : `/admin`
- **Composant** : `AdminView.vue`
- **Meta** : `{ requiresAuth: true, requiresRole: 'admin' }`
- **Garde personnalisée** : Vérifie le rôle admin avant l'accès via localStorage

```javascript
{
  path: '/admin',
  name: 'Admin',
  component: AdminView,
  meta: {
    requiresAuth: true,
    requiresRole: 'admin' // ✅ Nécessite le rôle admin
  },
  // ✅ Garde spécifique pour vérifier le rôle admin
  beforeEnter: (to, from, next) => {
    if (!authUtils.isAuthenticated()) {
      next(`/login?redirect=${to.path}`);
      return;
    }
    
    if (!authUtils.hasRole('admin')) {
      alert('Accès refusé : vous n\'avez pas les permissions nécessaires.');
      next('/profile');
      return;
    }
    
    next(); // ✅ Autoriser l'accès
  }
}
```

### 4. Composant `EditorView.vue` avec `beforeRouteLeave`

**Fichier** : `client/src/views/EditorView.vue`
- **Fonctionnalité** : Éditeur de contenu avec détection des modifications
- **Garde** : Prévient l'utilisateur avant de quitter en cas de modifications non sauvegardées

```javascript
// ✅ Garde de navigation pour prévenir la perte de modifications
beforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    const answer = window.confirm(
      'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter cette page ?'
    )
    if (answer) {
      next() // ✅ Autoriser la navigation
    } else {
      next(false) // ✅ Annuler la navigation
    }
  } else {
    next() // ✅ Continuer normalement
  }
})
```

## 🏪 Gestion de l'Authentification avec localStorage

**Fichier** : `client/src/composables/useAuth.js`
- **Framework** : Composables Vue 3 (Composition API)
- **Stockage** : localStorage direct avec gestion des erreurs
- **Fonctionnalités** :
  - Login/logout
  - Gestion des rôles (`user`, `admin`)
  - Vérification des permissions
  - État réactif global
  - Fonctions utilitaires pour le routeur

### Structure localStorage

```javascript
// Clés utilisées dans localStorage
const STORAGE_KEYS = {
  USER: 'auth_user',        // Informations utilisateur
  TOKEN: 'auth_token',      // Token d'authentification
  ROLE: 'auth_role'         // Rôle utilisateur
}
```

### Composable useAuth

```javascript
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
    initializeAuth
  }
}
```

### Fonctions utilitaires pour le routeur

```javascript
export const authUtils = {
  isAuthenticated: () => checkAuth(),
  getRole: () => storage.get(STORAGE_KEYS.ROLE),
  hasRole: (requiredRole) => {
    const userRole = storage.get(STORAGE_KEYS.ROLE)
    return userRole === requiredRole || userRole === 'admin'
  },
  getUserInfo: () => getUserFromStorage()
}
```

## 🔧 Avantages de localStorage vs Store Pinia

### ✅ Avantages

- **Simplicité** : Pas de dépendance externe (Pinia)
- **Persistance native** : Les données survivent au rechargement de page
- **Performance** : Accès direct sans overhead de store
- **Compatibilité** : Fonctionne dans tous les navigateurs modernes
- **Debugging** : Inspection facile via DevTools du navigateur

### ⚠️ Considérations

- **Sécurité** : localStorage est accessible côté client
- **Taille limitée** : ~5-10MB selon le navigateur
- **Synchronisation** : Pas de synchronisation automatique entre onglets
- **Structure** : Gestion manuelle de la sérialisation JSON

## 🧪 Test des Fonctionnalités

### Scénarios de Test

1. **Accès sans authentification**
   - Aller sur `/profile` → Redirection vers `/login`
   - Aller sur `/admin` → Redirection vers `/login`
   - Aller sur `/editor` → Redirection vers `/login`

2. **Authentification utilisateur normal**
   - Se connecter avec le rôle "user"
   - Accès autorisé à `/profile` et `/editor`
   - Accès refusé à `/admin` avec message d'erreur
   - Données persistantes après rechargement

3. **Authentification administrateur**
   - Se connecter avec le rôle "admin"
   - Accès autorisé à toutes les routes protégées
   - Accès spécial à `/admin`
   - Persistance du rôle admin

4. **Protection contre la perte de données**
   - Aller sur `/editor`
   - Modifier du contenu (titre, texte, tags)
   - Essayer de naviguer ailleurs → Confirmation demandée
   - Sauvegarder puis naviguer → Pas de confirmation

### Inspection localStorage

Ouvrez les DevTools (F12) et allez dans l'onglet Application/Storage pour voir :
- `auth_user` : Informations utilisateur
- `auth_token` : Token d'authentification
- `auth_role` : Rôle de l'utilisateur

### Instructions de Test

1. **Démarrer l'application**
   ```bash
   cd client
   npm run dev
   ```

2. **Tester les scénarios**
   - Utiliser le menu de navigation
   - Observer le panneau de debug (coin supérieur droit)
   - Tester les différents rôles lors de la connexion
   - Recharger la page pour vérifier la persistance

## 📋 Routes Disponibles

| Route | Authentification | Rôle | Description |
|-------|-----------------|------|-------------|
| `/` | ❌ | Public | Page d'accueil |
| `/login` | ❌ | Public | Page de connexion |
| `/product/:id` | ❌ | Public | Page produit |
| `/profile` | ✅ | User/Admin | Profil utilisateur |
| `/dashboard` | ✅ | User/Admin | Tableau de bord |
| `/editor` | ✅ | User/Admin | Éditeur avec protection des modifications |
| `/admin` | ✅ | Admin uniquement | Panneau d'administration |

## 🔧 Configuration

L'authentification utilise localStorage pour la persistance. Dans un vrai projet :
- **Sécurité** : Chiffrer les données sensibles avant stockage
- **Validation** : Vérifier la validité des tokens côté serveur
- **Expiration** : Implémenter l'expiration automatique des sessions
- **Synchronisation** : Gérer la synchronisation entre onglets si nécessaire

## 📱 Interface Utilisateur

- **Menu adaptatif** : S'adapte selon l'état d'authentification
- **Indicateurs visuels** : Statut de connexion et rôle affiché
- **Panneau de debug** : Informations en temps réel sur l'état d'authentification
- **Messages d'erreur** : Notifications claires pour les accès refusés
- **Persistance** : État conservé après rechargement de page

## 🔄 Migration de Pinia vers localStorage

### Changements effectués

1. **Suppression** du store Pinia (`client/src/stores/auth.js`)
2. **Création** du composable `useAuth.js` avec gestion localStorage
3. **Mise à jour** de tous les composants pour utiliser le composable
4. **Adaptation** du routeur avec `authUtils`
5. **Conservation** de toutes les fonctionnalités existantes

### État réactif conservé

Grâce à l'utilisation de `ref()` et `computed()` dans le composable, l'interface reste parfaitement réactive même sans Pinia. 