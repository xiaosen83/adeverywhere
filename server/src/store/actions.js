import * as types from './mutation-types'

export default {
  addTotalTime ({ commit }, time) {
    commit(types.ADD_TOTAL_TIME, time)
  },
  saveToken ({ commit }, token) {
    commit(types.SAVE_TOKEN, token)
  }
}
