import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () => import('../components/Home.vue')
const Tutorials = () => import('../components/Tutorials.vue')
const Staking = () => import('../components/Staking.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/Tutorials',
    name: 'Tutorials',
    component: Tutorials
  },
  {
    path: '/staking',
    name: 'staking',
    component: Staking
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
