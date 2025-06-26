import { createRouter, createWebHistory } from 'vue-router';
import { authUtils } from '../composables/useAuth';
import HomeView from '../views/HomeView.vue';
import ProductView from '../views/ProductView.vue';
import DashboardView from '../views/DashboardView.vue';
import OverviewView from '../views/OverviewView.vue';
import StatsView from '../views/StatsView.vue';
import LoginView from '../views/LoginView.vue';
import ProfileView from '../views/ProfileView.vue';
import AdminView from '../views/AdminView.vue';
import EditorView from '../views/EditorView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: {
      requiresAuth: true, // Route protégée par authentification
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: {
      requiresAuth: true,
      requiresRole: 'admin' // Nécessite le rôle admin
    },
    // Garde spécifique pour vérifier le rôle admin
    beforeEnter: (to, from, next) => {
      if (!authUtils.isAuthenticated()) {
        // Si pas connecté, rediriger vers login avec la page demandée
        next(`/login?redirect=${to.path}`);
        return;
      }
      
      if (!authUtils.hasRole('admin')) {
        // Si pas le bon rôle, afficher une erreur et rediriger
        alert('Accès refusé : vous n\'avez pas les permissions nécessaires pour accéder à cette page.');
        next('/profile'); // Rediriger vers le profil
        return;
      }
      
      next(); // Autoriser l'accès
    }
  },
  {
    path: '/editor',
    name: 'Editor',
    component: EditorView,
    meta: {
      requiresAuth: true,
    }
  },
  { 
    path: '/product/:productId', 
    name: 'Product', 
    component: ProductView,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    redirect: '/dashboard/overview', // Redirection par défaut vers overview
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: OverviewView,
        meta: {
          requiresAuth: true,
        }
      },
      {
        path: 'stats',
        name: 'Stats',
        component: StatsView,
        meta: {
          requiresAuth: true,
        }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Garde globale beforeEach - Gestion de l'authentification
router.beforeEach((to, from, next) => {
  // Vérifier si la route nécessite une authentification
  if (to.meta.requiresAuth) {
    if (!authUtils.isAuthenticated()) {
      // Rediriger vers la page de login avec l'URL de destination
      next(`/login?redirect=${to.path}`);
      return;
    }
    
    // Vérifier les rôles si spécifiés dans les meta
    if (to.meta.requiresRole && !authUtils.hasRole(to.meta.requiresRole)) {
      alert(`Accès refusé : le rôle "${to.meta.requiresRole}" est requis pour accéder à cette page.`);
      next('/profile');
      return;
    }
  }
  
  // Si on est déjà connecté et qu'on essaie d'accéder à la page de login
  if (to.name === 'Login' && authUtils.isAuthenticated()) {
    next('/profile'); // Rediriger vers le profil
    return;
  }
  
  next(); // Continuer la navigation
});

router.beforeResolve((to, from, next) => {
  // Cette garde s'exécute après beforeEach et les gardes de composants
  // Utile pour des vérifications finales ou du loading
  console.log(`Navigation résolue vers: ${to.path}`);
  next();
});

router.afterEach((to, from) => {
  // Actions après navigation (analytics, title, etc.)
  document.title = `Mon App - ${to.name || 'Page'}`;
  console.log(`Navigation terminée: ${from.path} → ${to.path}`);
});

export default router; 