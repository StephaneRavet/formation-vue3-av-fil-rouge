import { createRouter, createWebHistory } from 'vue-router';
import { defineAsyncComponent, h, Suspense } from 'vue';

// Exemple de routes asynchrones
const Home = defineAsyncComponent(() => import('../views/HomeView.vue'));
const About = defineAsyncComponent(() => import('../views/AboutView.vue'));

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guards (hooks) vides
router.beforeEach((to, from, next) => {
  // TODO: add logic
  next();
});

router.beforeResolve((to, from, next) => {
  // TODO: add logic
  next();
});

router.afterEach((to, from) => {
  // TODO: add logic
});

export default router; 