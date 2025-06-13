import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Collect from '../views/Collect.vue'
import Create from '../views/Create.vue'
import Calendar from '../views/Calendar.vue'
import Social from '../views/Social.vue'
import Profile from '../views/Profile.vue'
import Onboarding from '../views/Onboarding.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/collect',
    name: 'Collect',
    component: Collect
  },
  {
    path: '/create',
    name: 'Create',
    component: Create
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar
  },
  {
    path: '/social',
    name: 'Social',
    component: Social
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: Onboarding
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router