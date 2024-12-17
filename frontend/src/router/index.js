import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home'
      }
    }, 
    {
      path: '/booking_process/:id',
      name: 'booking',
      component: () => import('../views/BookingProcessView.vue'),
      props: true,
      meta: {
        title: 'Book a trip'
      }
    },
    {
      path: '/booking/:id',
      name: 'View booking',
      component: () => import('../views/BookingView.vue'),
      props: true, 
      meta: {
        title: 'My trip'
      }
    },
    {
      path: '/my',
      name: 'My bookings',
      component: () => import('../views/MyView.vue'),
      meta: {
        title: 'My bookings'
      }
    }
  ]
})

export default router
