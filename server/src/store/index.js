import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
  token: null,
  totalTime: 0,
  list: []
}

const getters = {
  token: state => state.token,
  username: function (state) {
    if (state.token) {
      var payload = state.token.split('.')[1]
      payload = window.atob(payload)
      console.log('payload: ' + JSON.stringify(payload))
      payload = JSON.parse(payload)
      return payload.name
    } else {
      return ''
    }
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

