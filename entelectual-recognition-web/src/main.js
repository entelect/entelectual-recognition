import Vue from 'vue'
import _ from 'lodash'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'

Vue.config.productionTip = false
Vue.use(BootstrapVue)

Object.defineProperty(Vue.prototype, '$_', { value: _ })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
