import type { Router } from 'vue-router';

export const authenticationGuard = (router: Router) => {
  const isLogin = !!localStorage.getItem('userId');

  router.beforeEach((to) => {
    if (isLogin) {
      return true;
    }

    // 未認証状態で遷移を許可するルート
    if (['login'].includes(to.name as string)) {
      return true;
    }

    // ログインページへリダイレクト
    return { name: 'login' };
  });
};
