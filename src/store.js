import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    socket: null,
    messages: [],
    newCount: 0,
    curTabisLog: false,
    connected: false,
    interval: undefined,
    times: undefined,
    roomId: '',
    mode: 'normal',
    contents: [],
    contentInUse: new Set(),
    started: false,
    flv: '',
    hls: ''
  },
  mutations: {
    clearMessages(state) {
      state.messages = []
      state.newCount = 0
    },
    clearNewCount(state) {
      state.newCount = 0
    },
    incNewCount(state) {
      !state.curTabisLog && state.newCount++
    },
  }
})
