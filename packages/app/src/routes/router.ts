import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../pages/index.vue')
    },
    {
      path: '/client/:id',
      component: () => import('../pages/client.vue')
    }
  ],
})

export default router