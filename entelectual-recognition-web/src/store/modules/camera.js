const state = () => ({
  videoStream: null
})

const mutations = {
  start (state, video) {
    state.videoStream = video
  },
  stop (state) {
    if (state.videoStream) {
      state.videoStream.getTracks().forEach(track => track.stop())
      state.videoStream = null
    }
  },
  pause (state) {
    if (state.videoStream) {
      state.videoStream.getTracks().forEach(track => { track.enabled = false })
    }
  },
  resume (state) {
    if (state.videoStream) {
      state.videoStream.getTracks().forEach(track => { track.enabled = true })
    }
  }
}

const actions = {
  async startCamera ({ commit, state }) {
    if (!state.videoStream &&
      navigator &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        .catch(e => {
          console.log(e)
          throw new Error(e)
        })
      commit('start', stream)
      return stream
    } else {
      throw new Error('This browser doesn\'t support WebRTC')
    }
  },

  async stopCamera ({ commit }) {
    commit('stop')
  },

  async pauseCamera ({ commit }) {
    commit('pause')
  },

  async resumeCamera ({ commit }) {
    commit('resume')
  }
}

const getters = {
  isCameraStarted: (state) => {
    return !!state.videoStream
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
