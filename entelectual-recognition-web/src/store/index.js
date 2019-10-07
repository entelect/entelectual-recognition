import Vue from 'vue'
import Vuex from 'vuex'
import camera from './modules/camera'
import face from './modules/face'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'
const debug = false

export default new Vuex.Store({
  modules: {
    camera,
    face
  },
  strict: debug
})
