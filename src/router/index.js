import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/HomeView.vue') },
  { path: '/health-resources', name: 'HealthResources', component: () => import('../views/HealthResourcesView.vue') },
  { path: '/community', name: 'CommunitySupport', component: () => import('../views/CommunityView.vue') },
  { path: '/caregivers', name: 'CaregiverHub', component: () => import('../views/CaregiverResourcesView.vue') },
  { path: '/contact', name: 'ContactUs', component: () => import('../views/ContactEmailView.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router