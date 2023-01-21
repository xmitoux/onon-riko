import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/home/HomePage.vue';
const CalendarPage = () => import('@/pages/CalendarPage.vue');
const RankingPage = () => import('@/pages/RankingPage.vue');
const SettingsPage = () => import('@/pages/SettingsPage.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarPage,
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: RankingPage,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage,
    },
  ],
});

export default router;
