import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
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