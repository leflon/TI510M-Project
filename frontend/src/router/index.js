import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    }, 
    {
      path: '/booking_process/:id',
      name: 'booking',
      component: () => import('../views/BookingProcessView.vue'),
      props: true
    }
  ]
})

export default router
