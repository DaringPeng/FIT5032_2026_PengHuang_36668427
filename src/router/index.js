import { createRouter, createWebHistory } from 'vue-router';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Home from '../views/Home.vue';

const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true } },
  { path: '/senior', component: () => import('../views/SeniorHub.vue'), meta: { requiresAuth: true } },
  { path: '/caregiver', component: () => import('../views/CaregiverHub.vue'), meta: { requiresAuth: true } },
  { path: '/community', component: () => import('../views/Community.vue'), meta: { requiresAuth: true } },
  { path: '/about', component: () => import('../views/About.vue'), meta: { requiresAuth: true } },
  { path: '/auth', component: () => import('../views/Auth.vue') },
  { path: '/unauthorized', component: () => import('../views/AccessDenied.vue') },
  { 
    path: '/admin', 
    component: () => import('../views/Admin.vue'),
    meta: { requiresAuth: true, requiresAdmin: true } 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const currentUser = auth.currentUser;

  if (requiresAuth && !currentUser) {
    next('/auth');
  } else if (requiresAuth && requiresAdmin && currentUser) {
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (userDoc.exists() && userDoc.data().role === 'admin') {
      next();
    } else {
      next('/unauthorized');
    }
  } else {
    next();
  }
});

export default router;