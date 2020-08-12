import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Login',
    meta: {
      requireVisitor: true
    },
    component: () => import(/* webpackChunkName: "login" */ '../components/Login.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {
      requireAuth: true
    },
    component: () => import(/* webpackChunkName: "dashboard" */ '../components/Dashboard.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

router.beforeEach((to,from,next) => {
  if(to.matched.some(record => record.meta.requireAuth)) {
    if(!store.getters.onLogin) {
      alert("Hey trashpasser you're not allowed to enter there !!")
      next({name:'Login'})
    }else{
      next()
    }
  }else if(to.matched.some(record => record.meta.requireVisitor)) {
    if(store.getters.onLogin) {
      next({name:'Dashboard'})
    }else{
      next()
    }
  }else{
    next()
  }
})