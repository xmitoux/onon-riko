import { createRouter, createWebHistory } from 'vue-router';
import { authenticationGuard } from '@/router/auth-guard';

import HomePage from '@/pages/home/HomePage.vue';
const CalendarPage = () => import('@/pages/calendar/CalendarPage.vue');
const RankingPage = () => import('@/pages/ranking/RankingPage.vue');
const SettingsPage = () => import('@/pages/settings/SettingsPage.vue');
const LoginPage = () => import('@/pages/LoginPage.vue');

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
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
  ],
});

authenticationGuard(router);

export default router;
