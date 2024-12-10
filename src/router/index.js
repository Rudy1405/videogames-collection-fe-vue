import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/views/LoginPage.vue';
import FeedPage from '@/views/FeedPage.vue';

const routes = [
  { path: '/', name: 'Login', component: LoginPage },
  { path: '/feed', name: 'Feed', component: FeedPage },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
