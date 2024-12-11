import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/views/LoginPage.vue';
import FeedPage from '@/views/FeedPage.vue';
import GameDetailsPage from '@/views/GameDetailsPage.vue';
import CollectionPage from '@/views/CollectionPage.vue';
import ProfilePage from '@/views/ProfilePage.vue';

const routes = [
  { path: '/', name: 'Login', component: LoginPage },
  { path: '/feed', name: 'Feed', component: FeedPage },
  { path: '/game/:id', name: 'GameDetails', component: GameDetailsPage },
  { path: '/collection', name: 'Collection', component: CollectionPage },
  { path: '/profile/:id', name: 'profile', component: ProfilePage },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
