import * as types from './mutation-types'

export default {
  [types.ADD_TOTAL_TIME] (state, time) {
    state.totalTime = state.totalTime + time
  },
  [types.SAVE_TOKEN] (state, token) {
    state.token = token
  }
}
