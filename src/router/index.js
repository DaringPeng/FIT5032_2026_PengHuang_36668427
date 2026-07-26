import { createRouter, createWebHistory } from 'vue-router'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/HomeView.vue') },
  { path: '/login', name: 'Login', component: () => import('../views/LoginView.vue') },
  { path: '/register', name: 'Register', component: () => import('../views/RegisterView.vue') },
  { 
    path: '/health-resources', 
    name: 'HealthResources', 
    component: () => import('../views/HealthResourcesView.vue'),
    meta: { requiresAuth: true } // BR C.1: Accessible only to logged-in users
  },
  { 
    path: '/caregivers', 
    name: 'CaregiverHub', 
    component: () => import('../views/CaregiverResourcesView.vue'),
    meta: { requiresAuth: true, role: 'caregiver' } // BR C.2: Accessible only to caregiver
  },
  {
    path: '/community',
    name: 'Community',
    component: () => import('../views/CommunityView.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/ContactEmailView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard：Secure Navigation and Role-based authentication
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiredRole = to.matched.find(record => record.meta.role)?.meta.role
  const user = auth.currentUser

  if (requiresAuth && !user) {
    next('/login')
  } else if (requiresAuth && user && requiredRole) {
    const userDoc = await getDoc(doc(db, "users", user.uid))
    if (userDoc.exists() && userDoc.data().role === requiredRole) {
      next()
    } else {
      alert('Access Denied: You do not have the required role.')
      next('/')
    }
  } else {
    next()
  }
})

export default router