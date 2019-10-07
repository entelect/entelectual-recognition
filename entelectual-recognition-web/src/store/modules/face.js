import * as faceapi from 'face-api.js'
import axios from 'axios'

const state = () => ({
  faces: [],
  loading: false,
  loaded: false,
  faceMatcher: null,

  matchCountForSameMatch: 15,
  currentMatch: '',
  previousMatch: '',
  matchCounter: 0,
  multipeSameMatch: false,

  useTiny: false,

  detections: {
    scoreThreshold: 0.7,
    inputSize: 256,
    boxColor: '#61892F',
    textColor: '#86C232',
    lineWidth: 1,
    fontSize: 20,
    fontStyle: 'Georgia'
  },
  expressions: {
    minConfidence: 0.2
  },
  landmarks: {
    drawLines: true,
    lineWidth: 1
  },
  descriptors: {
    withDistance: false
  }
})

const mutations = {
  loading (state) {
    state.loading = true
  },

  load (state) {
    state.loading = false
    state.loaded = true
  },

  setFaces (state, faces) {
    state.faces = faces
  },

  setFaceMatcher (state, matcher) {
    state.faceMatcher = matcher
  },

  setMatch (state, bestMatch) {
    state.previousMatch = state.currentMatch
    state.currentMatch = bestMatch.label

    if (state.previousMatch && state.currentMatch && state.matchCounter < state.matchCountForSameMatch) {
      state.matchCounter++
      state.multipeSameMatch = false
    } else if (state.previousMatch && state.currentMatch && state.matchCounter >= state.matchCountForSameMatch) {
      state.matchCounter = 0
      state.multipeSameMatch = true
    } else {
      state.matchCounter = 0
      state.multipeSameMatch = false
    }
  },

  resetMatch (state) {
    state.previousMatch = ''
    state.currentMatch = ''
    state.matchCounter = 0
    state.multipeSameMatch = false
  }
}

const actions = {
  async load ({ commit, state }) {
    if (!state.loading && !state.loaded) {
      commit('loading')
      return Promise.all([
        faceapi.loadFaceRecognitionModel('/data/models'),
        faceapi.loadFaceLandmarkModel('/data/models'),
        faceapi.loadTinyFaceDetectorModel('/data/models'),
        faceapi.loadFaceExpressionModel('/data/models')
      ])
        .then(() => {
          commit('load')
        })
    }
  },
  async getAll ({ commit, state }) {
    const response = await axios.get('http://localhost:3000/v1/model/face')
    commit('setFaces', response.data)
  },
  async save ({ commit }, faces) {
    const { data } = await this.$axios.$post('/api/face/save', { faces })
    commit('setFaces', data)
  },
  getFaceMatcher ({ commit, state }) {
    const labeledDescriptors = []
    state.faces.forEach(face => {
      let descriptors = face.descriptors.map(desc => {
        if (desc.descriptor) {
          let descArray = []
          for (var i in desc.descriptor) {
            descArray.push(parseFloat(desc.descriptor[i]))
          }
          return new Float32Array(descArray)
        }
      })
      if (descriptors.length) {
        labeledDescriptors.push(
          new faceapi.LabeledFaceDescriptors(
            face.user,
            descriptors
          ))
      }
    })
    const matcher = new faceapi.FaceMatcher(labeledDescriptors)
    commit('setFaceMatcher', matcher)
    return matcher
  },

  async getFaceDetection ({ commit, state }, { canvas }) {
    const detections = await faceapi.detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions({
      scoreThreshold: state.detections.scoreThreshold,
      inputSize: state.detections.inputSize
    })).withFaceLandmarks().withFaceDescriptor()
    return detections
  },

  async recognize ({ commit, state }, { descriptor }) {
    const bestMatch = await state.faceMatcher.findBestMatch(descriptor)
    commit('setMatch', bestMatch)
    return bestMatch
  },

  draw ({ commit, state }, { canvasCtx, detection }) {
    let name = ''
    if (detection.recognition) {
      name = detection.recognition.toString(state.descriptors.withDistance)
    }

    name = name.replace(/-/g, ' ')

    const box = detection.box || detection.detection.box
    if (box) {
      // draw box
      canvasCtx.strokeStyle = state.detections.boxColor
      canvasCtx.lineWidth = state.detections.lineWidth
      canvasCtx.strokeRect(box.x, box.y, box.width, box.height)
    }
    if (name && detection && box) {
      // draw text
      const padText = 2 + state.detections.lineWidth
      canvasCtx.fillStyle = state.detections.textColor
      canvasCtx.font = state.detections.fontSize + 'px ' + state.detections.fontStyle
      canvasCtx.fillText(name, box.x + padText, box.y + box.height + padText + (state.detections.fontSize * 0.6))
    }
  },

  async createCanvas ({ commit, state }, elementId) {
    const canvas = await faceapi.createCanvasFromMedia(document.getElementById(elementId))
    return canvas
  },

  async isMultipeSameMatch ({ commit, state }) {
    return state.multipeSameMatch
  },

  async getCurrentMatch ({ commit, state }) {
    return state.currentMatch.replace(/-/g, ' ')
  },

  async resetMatch ({ commit, state }) {
    commit('resetMatch')
  },

  async getEvents ({ commit, state }) {
    const { data } = await axios.get('http://localhost:3000/v1/event')
    return data
  },

  async getAttendees ({ commit, state }, { eventId }) {
    const { data } = await axios.get('http://localhost:3000/v1/attendee', {
      params: {
        eventId: eventId
      }
    })
    return data
  },

  async addAttendee ({ commit, state }, { username, eventId }) {
    const { data } = await axios.post('http://localhost:3000/v1/attendee/add', {
      username: username,
      eventId: eventId
    }
    )
    return data
  }
}

const getters = {
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
