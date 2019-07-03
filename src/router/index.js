import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/home.vue')
    },
    {
      path: '/network',
      name: 'network',
      component: () => import('../pages/network.vue')
    }
  ]
})
