import Vue from 'vue'
import Router from 'vue-router'
import Recognize from './views/Recognize.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Recognize',
      component: Recognize
    }
  ]
})
